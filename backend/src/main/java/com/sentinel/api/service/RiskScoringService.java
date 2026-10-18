package com.sentinel.api.service;

import com.sentinel.api.detection.DetectionResult;
import com.sentinel.api.entity.DetectionType;
import com.sentinel.api.entity.IncidentSeverity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RiskScoringService {

    public record ScoreFactor(String factor, int points) {}

    public static class RiskAssessment {
        private final int score;
        private final IncidentSeverity severity;
        private final List<ScoreFactor> factors;
        private final List<String> reasons;

        public RiskAssessment(int score, IncidentSeverity severity, List<ScoreFactor> factors) {
            this.score = score;
            this.severity = severity;
            this.factors = factors != null ? Collections.unmodifiableList(factors) : Collections.emptyList();
            this.reasons = this.factors.stream().map(ScoreFactor::factor).toList();
        }

        public int getScore() {
            return score;
        }

        public IncidentSeverity getSeverity() {
            return severity;
        }

        public List<ScoreFactor> getFactors() {
            return factors;
        }

        public List<String> getReasons() {
            return reasons;
        }

        @Override
        public String toString() {
            return "RiskAssessment{" +
                    "score=" + score +
                    ", severity=" + severity +
                    ", factors=" + factors +
                    '}';
        }
    }

    public static class RiskContext {
        private final boolean highAuthFailureRate;
        private final boolean excessiveRateContext;

        public RiskContext(boolean highAuthFailureRate, boolean excessiveRateContext) {
            this.highAuthFailureRate = highAuthFailureRate;
            this.excessiveRateContext = excessiveRateContext;
        }

        public static RiskContext empty() {
            return new RiskContext(false, false);
        }

        public static RiskContext of(boolean highAuthFailureRate, boolean excessiveRateContext) {
            return new RiskContext(highAuthFailureRate, excessiveRateContext);
        }

        public boolean isHighAuthFailureRate() {
            return highAuthFailureRate;
        }

        public boolean hasExcessiveRateContext() {
            return excessiveRateContext;
        }
    }

    /**
     * Map a numeric risk score (0-100) to IncidentSeverity.
     * 0–29: LOW
     * 30–59: MEDIUM
     * 60–79: HIGH
     * 80–100: CRITICAL
     */
    public IncidentSeverity calculateSeverity(int score) {
        int clamped = Math.clamp(score, 0, 100);
        if (clamped >= 80) {
            return IncidentSeverity.CRITICAL;
        }
        if (clamped >= 60) {
            return IncidentSeverity.HIGH;
        }
        if (clamped >= 30) {
            return IncidentSeverity.MEDIUM;
        }
        return IncidentSeverity.LOW;
    }

    /**
     * Overload for evaluating detection results without extra context.
     */
    public RiskAssessment calculateScore(List<DetectionResult> detections) {
        return calculateScore(detections, RiskContext.empty());
    }

    /**
     * Overload for evaluating a single detection result.
     */
    public RiskAssessment calculateScore(DetectionResult detection) {
        if (detection == null) {
            return calculateScore(Collections.emptyList(), RiskContext.empty());
        }
        return calculateScore(List.of(detection), RiskContext.empty());
    }

    /**
     * Calculate composite risk score and severity based on detection results and context.
     */
    public RiskAssessment calculateScore(List<DetectionResult> detections, RiskContext context) {
        if (detections == null || detections.isEmpty()) {
            return new RiskAssessment(0, IncidentSeverity.LOW, Collections.emptyList());
        }

        List<ScoreFactor> factors = new ArrayList<>();
        Set<DetectionType> processedTypes = new HashSet<>();
        int rawScore = 0;

        for (DetectionResult detection : detections) {
            if (detection == null || detection.getDetectionType() == null) {
                continue;
            }

            DetectionType type = detection.getDetectionType();
            // Prevent adding the same rule contribution repeatedly for duplicate events in one burst
            if (processedTypes.contains(type)) {
                continue;
            }
            processedTypes.add(type);

            switch (type) {
                case BRUTE_FORCE -> {
                    factors.add(new ScoreFactor("Brute-force behavior", 50));
                    rawScore += 50;

                    // High authentication-failure rate context (+20 points)
                    if (context != null && context.isHighAuthFailureRate()) {
                        factors.add(new ScoreFactor("High authentication-failure rate", 20));
                        rawScore += 20;
                    }
                }
                case SQL_INJECTION_PATTERN -> {
                    factors.add(new ScoreFactor("SQL injection-like input detected", 30));
                    rawScore += 30;
                }
                case API_ABUSE -> {
                    factors.add(new ScoreFactor("Excessive API usage", 15));
                    rawScore += 15;
                }
            }
        }

        // Additional context factor: excessive request activity (+15 points)
        if (context != null && context.hasExcessiveRateContext() && !processedTypes.contains(DetectionType.API_ABUSE)) {
            factors.add(new ScoreFactor("Excessive request activity", 15));
            rawScore += 15;
        }

        // Clamp the final score to 0–100 range
        int finalScore = Math.clamp(rawScore, 0, 100);
        IncidentSeverity severity = calculateSeverity(finalScore);

        return new RiskAssessment(finalScore, severity, factors);
    }
}
