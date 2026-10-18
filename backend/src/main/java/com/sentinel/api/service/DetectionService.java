package com.sentinel.api.service;

import com.sentinel.api.detection.DetectionResult;
import com.sentinel.api.entity.ApiEvent;
import com.sentinel.api.entity.DetectionRule;
import com.sentinel.api.entity.DetectionType;
import com.sentinel.api.entity.Incident;
import com.sentinel.api.repository.ApiEventRepository;
import com.sentinel.api.repository.DetectionRuleRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class DetectionService {

    private static final Logger log = LoggerFactory.getLogger(DetectionService.class);

    // Compiled regex patterns for SQL injection-like detection
    private static final List<Pattern> SQLI_PATTERNS = List.of(
            // Tautology variations: ' OR '1'='1, ' or 1=1, " or ""="", ' or 'a'='a
            Pattern.compile("('|\")\\s*or\\s+('?\\d+'?|'?[a-zA-Z]+'?)\\s*=\\s*('?\\d+'?|'?[a-zA-Z]+'?)", Pattern.CASE_INSENSITIVE),
            Pattern.compile("\\bor\\s+(1\\s*=\\s*1|true\\s*=\\s*true)\\b", Pattern.CASE_INSENSITIVE),
            // UNION [ALL] SELECT
            Pattern.compile("\\bunion\\s+(all\\s+)?select\\b", Pattern.CASE_INSENSITIVE),
            // DROP / ALTER / TRUNCATE TABLE
            Pattern.compile("\\b(drop|alter|truncate)\\s+table\\b", Pattern.CASE_INSENSITIVE),
            // SQL comment terminations: ;-- or ;/*
            Pattern.compile(";\\s*(--|/\\*)", Pattern.CASE_INSENSITIVE),
            // Stacked queries: ; EXEC or ; SELECT
            Pattern.compile(";\\s*(exec|execute|select|insert|update|delete)\\b", Pattern.CASE_INSENSITIVE),
            // Time-based blind: WAITFOR DELAY or BENCHMARK
            Pattern.compile("\\b(waitfor\\s+delay|benchmark\\s*\\()", Pattern.CASE_INSENSITIVE)
    );

    private final DetectionRuleRepository ruleRepository;
    private final ApiEventRepository apiEventRepository;
    private final RiskScoringService riskScoringService;
    private final IncidentService incidentService;

    public DetectionService(DetectionRuleRepository ruleRepository,
                            ApiEventRepository apiEventRepository,
                            RiskScoringService riskScoringService,
                            IncidentService incidentService) {
        this.ruleRepository = ruleRepository;
        this.apiEventRepository = apiEventRepository;
        this.riskScoringService = riskScoringService;
        this.incidentService = incidentService;
    }

    /**
     * Seed default detection rules idempotently at startup.
     */
    @PostConstruct
    @Transactional
    public void initDefaultRules() {
        try {
            initRuleIfNotExists(
                    "Brute Force Detection",
                    DetectionType.BRUTE_FORCE,
                    "Flags source IP when > 5 failed login attempts (401) occur within 60 seconds.",
                    5,
                    60
            );

            initRuleIfNotExists(
                    "Excessive API Usage / API Abuse",
                    DetectionType.API_ABUSE,
                    "Flags client when > 100 HTTP requests are recorded from same IP within 60 seconds.",
                    100,
                    60
            );

            initRuleIfNotExists(
                    "SQL Injection-Like Pattern Detection",
                    DetectionType.SQL_INJECTION_PATTERN,
                    "Inspects query parameters and payloads for SQL injection signatures (e.g. ' OR '1'='1, UNION SELECT, DROP TABLE).",
                    1,
                    60
            );
            log.info("Detection rules initialized successfully.");
        } catch (Exception e) {
            log.error("Failed to seed default detection rules: {}", e.getMessage(), e);
        }
    }

    private void initRuleIfNotExists(String name, DetectionType type, String description, int threshold, int timeWindow) {
        if (!ruleRepository.existsByType(type)) {
            DetectionRule rule = new DetectionRule(name, type, description, threshold, timeWindow, true);
            ruleRepository.save(rule);
            log.info("Seeded default detection rule: {} ({})", name, type);
        }
    }

    /**
     * Evaluate an incoming API event against configured detection rules.
     * Generates detection results, computes risk score, and creates/updates security incidents.
     * Fail-safe: Any processing error is logged without failing the calling request.
     */
    @Transactional
    public List<DetectionResult> evaluateEvent(ApiEvent event) {
        if (event == null) {
            return Collections.emptyList();
        }

        List<DetectionResult> detections = new ArrayList<>();

        try {
            // 1. Evaluate Brute Force
            evaluateBruteForce(event).ifPresent(detections::add);

            // 2. Evaluate API Abuse
            evaluateApiAbuse(event).ifPresent(detections::add);

            // 3. Evaluate SQL Injection Pattern
            evaluateSqlInjection(event).ifPresent(detections::add);

            // If detections were made, calculate composite risk score and process incident
            if (!detections.isEmpty()) {
                RiskScoringService.RiskContext context = buildRiskContext(event);
                RiskScoringService.RiskAssessment assessment = riskScoringService.calculateScore(detections, context);

                log.warn("Security Detections triggered for IP {}: count={}, riskScore={}, severity={}",
                        event.getSourceIp(), detections.size(), assessment.getScore(), assessment.getSeverity());

                // Update event with detection flag
                event.setRiskFlag(true);
                event.setRiskType(detections.get(0).getDetectionType());

                // Process incident (with cooldown deduplication)
                for (DetectionResult detection : detections) {
                    incidentService.processDetection(detection, assessment);
                }
            }
        } catch (Exception e) {
            log.error("Error evaluating detection rules for event ID {}: {}", event.getId(), e.getMessage(), e);
        }

        return detections;
    }

    /**
     * Evaluate for brute-force attacks on login/auth endpoints.
     */
    public Optional<DetectionResult> evaluateBruteForce(ApiEvent event) {
        if (!isLoginEndpoint(event.getEndpoint())) {
            return Optional.empty();
        }

        // Only evaluate on authentication failure (e.g., HTTP 401 Unauthorized)
        if (event.getStatusCode() == null || event.getStatusCode() != 401) {
            return Optional.empty();
        }

        Optional<DetectionRule> ruleOpt = ruleRepository.findByType(DetectionType.BRUTE_FORCE);
        if (ruleOpt.isEmpty()) {
            log.warn("No detection rule configured for type BRUTE_FORCE");
            return Optional.empty();
        }

        DetectionRule rule = ruleOpt.get();
        if (!Boolean.TRUE.equals(rule.getEnabled())) {
            return Optional.empty();
        }

        int window = rule.getTimeWindow();
        int threshold = rule.getThreshold();
        LocalDateTime since = (event.getTimestamp() != null ? event.getTimestamp() : LocalDateTime.now())
                .minusSeconds(window);

        long failedAttempts = apiEventRepository.countFailedLoginAttempts(event.getSourceIp(), 401, since);

        if (failedAttempts > threshold) {
            String reason = String.format(
                    "Brute-force velocity threshold exceeded: %d failed login attempts within %ds from source IP %s (Threshold: > %d)",
                    failedAttempts, window, event.getSourceIp(), threshold
            );

            DetectionResult result = new DetectionResult(
                    DetectionType.BRUTE_FORCE,
                    event.getSourceIp(),
                    event.getEndpoint(),
                    event.getMethod(),
                    rule.getName(),
                    failedAttempts,
                    window,
                    50,
                    reason,
                    sanitizePayload(event.getRequestBody())
            );
            return Optional.of(result);
        }

        return Optional.empty();
    }

    /**
     * Evaluate for API abuse / rate flooding.
     */
    public Optional<DetectionResult> evaluateApiAbuse(ApiEvent event) {
        // Exclude internal health and monitoring checks
        if (isMonitoringEndpoint(event.getEndpoint())) {
            return Optional.empty();
        }

        Optional<DetectionRule> ruleOpt = ruleRepository.findByType(DetectionType.API_ABUSE);
        if (ruleOpt.isEmpty()) {
            log.warn("No detection rule configured for type API_ABUSE");
            return Optional.empty();
        }

        DetectionRule rule = ruleOpt.get();
        if (!Boolean.TRUE.equals(rule.getEnabled())) {
            return Optional.empty();
        }

        int window = rule.getTimeWindow();
        int threshold = rule.getThreshold();
        LocalDateTime since = (event.getTimestamp() != null ? event.getTimestamp() : LocalDateTime.now())
                .minusSeconds(window);

        long requestCount = apiEventRepository.countRecentRequestsExcludingHealth(event.getSourceIp(), since);

        if (requestCount > threshold) {
            String reason = String.format(
                    "API abuse threshold exceeded: %d requests within %ds from source IP %s (Threshold: > %d)",
                    requestCount, window, event.getSourceIp(), threshold
            );

            DetectionResult result = new DetectionResult(
                    DetectionType.API_ABUSE,
                    event.getSourceIp(),
                    event.getEndpoint(),
                    event.getMethod(),
                    rule.getName(),
                    requestCount,
                    window,
                    15,
                    reason,
                    String.format("%s %s (Burst of %d reqs)", event.getMethod(), event.getEndpoint(), requestCount)
            );
            return Optional.of(result);
        }

        return Optional.empty();
    }

    /**
     * Inspect request parameters, path, or body for SQL injection-like patterns.
     */
    public Optional<DetectionResult> evaluateSqlInjection(ApiEvent event) {
        Optional<DetectionRule> ruleOpt = ruleRepository.findByType(DetectionType.SQL_INJECTION_PATTERN);
        if (ruleOpt.isEmpty()) {
            log.warn("No detection rule configured for type SQL_INJECTION_PATTERN");
            return Optional.empty();
        }

        DetectionRule rule = ruleOpt.get();
        if (!Boolean.TRUE.equals(rule.getEnabled())) {
            return Optional.empty();
        }

        // Gather all inspectable inputs
        List<String> inputsToInspect = new ArrayList<>();
        if (event.getQueryParams() != null) {
            inputsToInspect.add(event.getQueryParams());
        }
        if (event.getEndpoint() != null) {
            inputsToInspect.add(event.getEndpoint());
        }
        if (event.getRequestBody() != null) {
            inputsToInspect.add(event.getRequestBody());
        }

        for (String rawInput : inputsToInspect) {
            String matchedCategory = checkSqlInjectionPattern(rawInput);
            if (matchedCategory != null) {
                String reason = String.format(
                        "SQL injection-like pattern detected in request input: %s. Signature category: %s",
                        sanitizeSnippet(rawInput), matchedCategory
                );

                DetectionResult result = new DetectionResult(
                        DetectionType.SQL_INJECTION_PATTERN,
                        event.getSourceIp(),
                        event.getEndpoint(),
                        event.getMethod(),
                        rule.getName(),
                        1L,
                        rule.getTimeWindow(),
                        30,
                        reason,
                        sanitizeSnippet(rawInput)
                );
                return Optional.of(result);
            }
        }

        return Optional.empty();
    }

    /**
     * Helper to inspect a string against SQL injection regexes with URL decoding and normalization.
     */
    public String checkSqlInjectionPattern(String input) {
        if (input == null || input.isBlank()) {
            return null;
        }

        String normalized = normalizeInput(input);

        for (Pattern pattern : SQLI_PATTERNS) {
            if (pattern.matcher(normalized).find()) {
                return describeMatchedPattern(pattern);
            }
        }

        return null;
    }

    private String normalizeInput(String input) {
        String decoded = input;
        try {
            decoded = URLDecoder.decode(input, StandardCharsets.UTF_8);
        } catch (Exception ignored) {
            // Fallback to raw string if decoding fails
        }
        // Normalize multiple spaces and lowercase for deterministic matching
        return decoded.replaceAll("\\s+", " ").toLowerCase(Locale.ROOT);
    }

    private String describeMatchedPattern(Pattern pattern) {
        String patternStr = pattern.pattern();
        if (patternStr.contains("union")) return "Union-Based Query Extraction";
        if (patternStr.contains("table")) return "Data Definition Statement (Table Manipulation)";
        if (patternStr.contains("waitfor") || patternStr.contains("benchmark")) return "Time-Based Blind Probe";
        if (patternStr.contains("--") || patternStr.contains("/*")) return "Inline Comment Termination";
        return "Boolean Tautology / Condition Override";
    }

    private boolean isLoginEndpoint(String endpoint) {
        if (endpoint == null) return false;
        String lower = endpoint.toLowerCase(Locale.ROOT);
        return lower.contains("/login") || lower.contains("/auth") || lower.contains("/signin");
    }

    private boolean isMonitoringEndpoint(String endpoint) {
        if (endpoint == null) return false;
        String lower = endpoint.toLowerCase(Locale.ROOT);
        return lower.contains("/actuator") || lower.contains("/health") || lower.contains("/metrics");
    }

    private RiskScoringService.RiskContext buildRiskContext(ApiEvent event) {
        boolean highAuthFailureRate = false;
        boolean excessiveRateContext = false;

        try {
            LocalDateTime since = LocalDateTime.now().minusSeconds(60);
            long totalLoginAttempts = apiEventRepository.countTotalLoginAttempts(event.getSourceIp(), since);
            long failedLoginAttempts = apiEventRepository.countFailedLoginAttempts(event.getSourceIp(), 401, since);

            if (totalLoginAttempts > 0 && failedLoginAttempts >= 5) {
                double failureRate = (double) failedLoginAttempts / totalLoginAttempts;
                if (failureRate >= 0.8) {
                    highAuthFailureRate = true;
                }
            }

            long totalRecentReqs = apiEventRepository.countRecentRequestsExcludingHealth(event.getSourceIp(), since);
            if (totalRecentReqs >= 50) {
                excessiveRateContext = true;
            }
        } catch (Exception e) {
            log.warn("Could not compute full risk context: {}", e.getMessage());
        }

        return new RiskScoringService.RiskContext(highAuthFailureRate, excessiveRateContext);
    }

    private String sanitizePayload(String payload) {
        if (payload == null || payload.isBlank()) return null;
        // Obfuscate password fields if present
        return payload.replaceAll("(?i)(\"password\"\\s*:\\s*\")[^\"]+(\")", "$1********$2");
    }

    private String sanitizeSnippet(String input) {
        if (input == null) return null;
        String trimmed = input.trim();
        if (trimmed.length() > 100) {
            return trimmed.substring(0, 97) + "...";
        }
        return trimmed;
    }
}
