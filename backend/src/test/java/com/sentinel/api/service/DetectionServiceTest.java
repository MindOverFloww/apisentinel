package com.sentinel.api.service;

import com.sentinel.api.detection.DetectionResult;
import com.sentinel.api.entity.ApiEvent;
import com.sentinel.api.entity.DetectionRule;
import com.sentinel.api.entity.DetectionType;
import com.sentinel.api.entity.Incident;
import com.sentinel.api.entity.IncidentSeverity;
import com.sentinel.api.entity.IncidentStatus;
import com.sentinel.api.repository.ApiEventRepository;
import com.sentinel.api.repository.DetectionRuleRepository;
import com.sentinel.api.repository.IncidentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DetectionServiceTest {

    @Mock
    private DetectionRuleRepository ruleRepository;

    @Mock
    private ApiEventRepository apiEventRepository;

    @Mock
    private IncidentRepository incidentRepository;

    private IncidentService incidentService;
    private RiskScoringService riskScoringService;
    private DetectionService detectionService;

    private DetectionRule bruteForceRule;
    private DetectionRule apiAbuseRule;
    private DetectionRule sqliRule;

    @BeforeEach
    void setUp() {
        riskScoringService = new RiskScoringService();
        incidentService = new IncidentService(incidentRepository);
        detectionService = new DetectionService(ruleRepository, apiEventRepository, riskScoringService, incidentService);

        bruteForceRule = new DetectionRule("Brute Force Detection", DetectionType.BRUTE_FORCE,
                "Flags when > 5 failed logins within 60s", 5, 60, true);

        apiAbuseRule = new DetectionRule("Excessive API Usage", DetectionType.API_ABUSE,
                "Flags when > 100 requests within 60s", 100, 60, true);

        sqliRule = new DetectionRule("SQL Injection Detection", DetectionType.SQL_INJECTION_PATTERN,
                "Flags SQL injection signatures", 1, 60, true);
    }

    @Test
    @DisplayName("1. No suspicious behavior produces no detection")
    void testNormalTrafficProducesNoDetection() {
        when(ruleRepository.findByType(DetectionType.API_ABUSE)).thenReturn(Optional.of(apiAbuseRule));
        when(ruleRepository.findByType(DetectionType.SQL_INJECTION_PATTERN)).thenReturn(Optional.of(sqliRule));

        ApiEvent event = new ApiEvent("GET", "/api/products", 200, "192.168.1.10");
        event.setQueryParams("category=books");

        when(apiEventRepository.countRecentRequestsExcludingHealth(eq("192.168.1.10"), any(LocalDateTime.class)))
                .thenReturn(15L);

        List<DetectionResult> detections = detectionService.evaluateEvent(event);

        assertTrue(detections.isEmpty());
        assertFalse(event.getRiskFlag());
    }

    @Test
    @DisplayName("2. Six failed login attempts from the same IP within 60s trigger brute-force detection")
    void testSixFailedLoginsTriggerBruteForce() {
        when(ruleRepository.findByType(DetectionType.BRUTE_FORCE)).thenReturn(Optional.of(bruteForceRule));

        ApiEvent event = new ApiEvent("POST", "/api/auth/login", 401, "192.168.1.100");

        // 6 failed logins reported from this IP within 60 seconds
        when(apiEventRepository.countFailedLoginAttempts(eq("192.168.1.100"), eq(401), any(LocalDateTime.class)))
                .thenReturn(6L);

        Optional<DetectionResult> result = detectionService.evaluateBruteForce(event);

        assertTrue(result.isPresent());
        assertEquals(DetectionType.BRUTE_FORCE, result.get().getDetectionType());
        assertEquals("192.168.1.100", result.get().getSourceIp());
        assertEquals(6L, result.get().getEventCount());
        assertEquals(50, result.get().getRiskContribution());
        assertTrue(result.get().getReason().contains("Brute-force velocity threshold exceeded"));
    }

    @Test
    @DisplayName("3. Exactly five failed attempts do not trigger a rule defined as more than five")
    void testFiveFailedLoginsDoNotTriggerBruteForce() {
        when(ruleRepository.findByType(DetectionType.BRUTE_FORCE)).thenReturn(Optional.of(bruteForceRule));

        ApiEvent event = new ApiEvent("POST", "/api/auth/login", 401, "192.168.1.100");

        // Exactly 5 failed attempts (threshold is > 5)
        when(apiEventRepository.countFailedLoginAttempts(eq("192.168.1.100"), eq(401), any(LocalDateTime.class)))
                .thenReturn(5L);

        Optional<DetectionResult> result = detectionService.evaluateBruteForce(event);

        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("4. Failed attempts distributed across different IP addresses do not incorrectly combine")
    void testFailedAttemptsDistributedAcrossDifferentIPsDoNotCombine() {
        when(ruleRepository.findByType(DetectionType.BRUTE_FORCE)).thenReturn(Optional.of(bruteForceRule));

        ApiEvent eventIpA = new ApiEvent("POST", "/api/auth/login", 401, "10.0.0.1");
        ApiEvent eventIpB = new ApiEvent("POST", "/api/auth/login", 401, "10.0.0.2");

        // IP A has 3 failed attempts, IP B has 3 failed attempts
        when(apiEventRepository.countFailedLoginAttempts(eq("10.0.0.1"), eq(401), any(LocalDateTime.class)))
                .thenReturn(3L);
        when(apiEventRepository.countFailedLoginAttempts(eq("10.0.0.2"), eq(401), any(LocalDateTime.class)))
                .thenReturn(3L);

        Optional<DetectionResult> resultA = detectionService.evaluateBruteForce(eventIpA);
        Optional<DetectionResult> resultB = detectionService.evaluateBruteForce(eventIpB);

        assertFalse(resultA.isPresent());
        assertFalse(resultB.isPresent());
    }

    @Test
    @DisplayName("5. Requests outside the time window do not count")
    void testRequestsOutsideTimeWindowDoNotCount() {
        when(ruleRepository.findByType(DetectionType.BRUTE_FORCE)).thenReturn(Optional.of(bruteForceRule));

        ApiEvent event = new ApiEvent("POST", "/api/auth/login", 401, "192.168.1.50");
        LocalDateTime eventTime = LocalDateTime.of(2026, 10, 10, 12, 0, 0);
        event.setTimestamp(eventTime);

        // Verify the repository query bounds the window using minusSeconds(60)
        when(apiEventRepository.countFailedLoginAttempts(eq("192.168.1.50"), eq(401), eq(eventTime.minusSeconds(60))))
                .thenReturn(2L); // Only 2 attempts within the 60-second window, older ones excluded

        Optional<DetectionResult> result = detectionService.evaluateBruteForce(event);

        assertFalse(result.isPresent());
        verify(apiEventRepository).countFailedLoginAttempts(eq("192.168.1.50"), eq(401), eq(eventTime.minusSeconds(60)));
    }

    @Test
    @DisplayName("6. More than 100 requests within configured window trigger API-abuse detection")
    void testMoreThan100RequestsTriggerApiAbuse() {
        when(ruleRepository.findByType(DetectionType.API_ABUSE)).thenReturn(Optional.of(apiAbuseRule));

        ApiEvent event = new ApiEvent("GET", "/api/orders", 200, "172.16.0.44");

        when(apiEventRepository.countRecentRequestsExcludingHealth(eq("172.16.0.44"), any(LocalDateTime.class)))
                .thenReturn(101L);

        Optional<DetectionResult> result = detectionService.evaluateApiAbuse(event);

        assertTrue(result.isPresent());
        assertEquals(DetectionType.API_ABUSE, result.get().getDetectionType());
        assertEquals("172.16.0.44", result.get().getSourceIp());
        assertEquals(101L, result.get().getEventCount());
        assertEquals(15, result.get().getRiskContribution());
        assertTrue(result.get().getReason().contains("API abuse threshold exceeded"));
    }

    @Test
    @DisplayName("7. Exactly 100 requests do not trigger a rule defined as more than 100")
    void testExactly100RequestsDoNotTriggerApiAbuse() {
        when(ruleRepository.findByType(DetectionType.API_ABUSE)).thenReturn(Optional.of(apiAbuseRule));

        ApiEvent event = new ApiEvent("GET", "/api/orders", 200, "172.16.0.44");

        when(apiEventRepository.countRecentRequestsExcludingHealth(eq("172.16.0.44"), any(LocalDateTime.class)))
                .thenReturn(100L);

        Optional<DetectionResult> result = detectionService.evaluateApiAbuse(event);

        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("8. SQL injection-like input is detected")
    void testSqlInjectionLikeInputIsDetected() {
        when(ruleRepository.findByType(DetectionType.SQL_INJECTION_PATTERN)).thenReturn(Optional.of(sqliRule));

        // Test classic tautology pattern: ' OR '1'='1
        ApiEvent event1 = new ApiEvent("GET", "/api/products", 200, "10.0.4.12");
        event1.setQueryParams("search=' OR '1'='1");

        Optional<DetectionResult> result1 = detectionService.evaluateSqlInjection(event1);
        assertTrue(result1.isPresent());
        assertEquals(DetectionType.SQL_INJECTION_PATTERN, result1.get().getDetectionType());
        assertTrue(result1.get().getReason().startsWith("SQL injection-like pattern detected"));

        // Test UNION SELECT
        ApiEvent event2 = new ApiEvent("GET", "/api/users/4", 200, "10.0.4.12");
        event2.setQueryParams("id=4 UNION SELECT username, password FROM users");

        Optional<DetectionResult> result2 = detectionService.evaluateSqlInjection(event2);
        assertTrue(result2.isPresent());
        assertEquals(DetectionType.SQL_INJECTION_PATTERN, result2.get().getDetectionType());
        assertTrue(result2.get().getReason().startsWith("SQL injection-like pattern detected"));

        // Test DROP TABLE
        ApiEvent event3 = new ApiEvent("POST", "/api/feedback", 200, "10.0.4.12");
        event3.setRequestBody("{\"comment\": \"; DROP TABLE users;--\"}");

        Optional<DetectionResult> result3 = detectionService.evaluateSqlInjection(event3);
        assertTrue(result3.isPresent());
        assertEquals(DetectionType.SQL_INJECTION_PATTERN, result3.get().getDetectionType());
    }

    @Test
    @DisplayName("9. Benign input does not trigger the SQL-like pattern rule")
    void testBenignInputDoesNotTriggerSqlRule() {
        when(ruleRepository.findByType(DetectionType.SQL_INJECTION_PATTERN)).thenReturn(Optional.of(sqliRule));

        ApiEvent event = new ApiEvent("GET", "/api/products", 200, "192.168.1.15");
        event.setQueryParams("category=electronics&search=laptop&sort=asc");

        Optional<DetectionResult> result = detectionService.evaluateSqlInjection(event);

        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("10. Disabled rules are not evaluated")
    void testDisabledRulesAreNotEvaluated() {
        bruteForceRule.setEnabled(false);
        apiAbuseRule.setEnabled(false);
        sqliRule.setEnabled(false);

        when(ruleRepository.findByType(DetectionType.BRUTE_FORCE)).thenReturn(Optional.of(bruteForceRule));
        when(ruleRepository.findByType(DetectionType.API_ABUSE)).thenReturn(Optional.of(apiAbuseRule));
        when(ruleRepository.findByType(DetectionType.SQL_INJECTION_PATTERN)).thenReturn(Optional.of(sqliRule));

        ApiEvent event = new ApiEvent("POST", "/api/auth/login", 401, "192.168.1.100");
        event.setQueryParams("search=' OR '1'='1");

        List<DetectionResult> detections = detectionService.evaluateEvent(event);

        assertTrue(detections.isEmpty());
        // Verify no repository count queries were executed
        verify(apiEventRepository, never()).countFailedLoginAttempts(anyString(), anyInt(), any());
        verify(apiEventRepository, never()).countRecentRequestsExcludingHealth(anyString(), any());
    }

    @Test
    @DisplayName("11. Duplicate detections do not generate duplicate incidents for the same attack burst")
    void testDuplicateDetectionsDoNotGenerateDuplicateIncidents() {
        DetectionResult bruteForce = new DetectionResult(
                DetectionType.BRUTE_FORCE, "192.168.1.100", "/api/auth/login", "POST",
                "Brute Force Detection", 6L, 60, 50,
                "Brute-force velocity threshold exceeded", "{}"
        );

        RiskScoringService.RiskAssessment assessment = new RiskScoringService.RiskAssessment(
                50, IncidentSeverity.MEDIUM, List.of(new RiskScoringService.ScoreFactor("Brute-force behavior", 50))
        );

        // First detection: no existing incident in cooldown -> new incident is saved
        when(incidentRepository.findTopBySourceIpAndTypeAndStatusAndCreatedAtAfterOrderByCreatedAtDesc(
                eq("192.168.1.100"), eq(DetectionType.BRUTE_FORCE), eq(IncidentStatus.OPEN), any(LocalDateTime.class)))
                .thenReturn(Optional.empty());

        Incident savedIncident = new Incident();
        savedIncident.setId(101L);
        savedIncident.setRequestCount(6);
        savedIncident.setRiskScore(50);
        when(incidentRepository.save(any(Incident.class))).thenReturn(savedIncident);

        Incident firstIncident = incidentService.processDetection(bruteForce, assessment);
        assertNotNull(firstIncident);

        // Second detection in same burst: existing incident is found -> updated rather than creating a new one
        when(incidentRepository.findTopBySourceIpAndTypeAndStatusAndCreatedAtAfterOrderByCreatedAtDesc(
                eq("192.168.1.100"), eq(DetectionType.BRUTE_FORCE), eq(IncidentStatus.OPEN), any(LocalDateTime.class)))
                .thenReturn(Optional.of(savedIncident));

        Incident deduplicatedIncident = incidentService.processDetection(bruteForce, assessment);

        assertEquals(101L, deduplicatedIncident.getId());
        assertEquals(7, deduplicatedIncident.getRequestCount()); // requestCount incremented from 6 to 7
    }

    @Test
    @DisplayName("12. Missing rule configuration is handled safely")
    void testMissingRuleConfigurationHandledSafely() {
        // Return empty Optional for rules
        when(ruleRepository.findByType(DetectionType.BRUTE_FORCE)).thenReturn(Optional.empty());
        when(ruleRepository.findByType(DetectionType.API_ABUSE)).thenReturn(Optional.empty());
        when(ruleRepository.findByType(DetectionType.SQL_INJECTION_PATTERN)).thenReturn(Optional.empty());

        ApiEvent event = new ApiEvent("POST", "/api/auth/login", 401, "192.168.1.100");
        event.setQueryParams("query=' OR 1=1");

        // Engine must not throw exception, fail safely and return empty
        assertDoesNotThrow(() -> {
            List<DetectionResult> detections = detectionService.evaluateEvent(event);
            assertTrue(detections.isEmpty());
        });
    }
}
