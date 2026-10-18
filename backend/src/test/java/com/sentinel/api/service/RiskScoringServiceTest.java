package com.sentinel.api.service;

import com.sentinel.api.detection.DetectionResult;
import com.sentinel.api.entity.DetectionType;
import com.sentinel.api.entity.IncidentSeverity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class RiskScoringServiceTest {

    private RiskScoringService riskScoringService;

    @BeforeEach
    void setUp() {
        riskScoringService = new RiskScoringService();
    }

    @Test
    @DisplayName("1. Score 0 maps to LOW")
    void testScore0MapsToLow() {
        IncidentSeverity severity = riskScoringService.calculateSeverity(0);
        assertEquals(IncidentSeverity.LOW, severity);

        // Also test bounds of LOW (0-29)
        assertEquals(IncidentSeverity.LOW, riskScoringService.calculateSeverity(29));
    }

    @Test
    @DisplayName("2. Score 30 maps to MEDIUM")
    void testScore30MapsToMedium() {
        IncidentSeverity severity = riskScoringService.calculateSeverity(30);
        assertEquals(IncidentSeverity.MEDIUM, severity);

        // Also test bounds of MEDIUM (30-59)
        assertEquals(IncidentSeverity.MEDIUM, riskScoringService.calculateSeverity(59));
    }

    @Test
    @DisplayName("3. Score 60 maps to HIGH")
    void testScore60MapsToHigh() {
        IncidentSeverity severity = riskScoringService.calculateSeverity(60);
        assertEquals(IncidentSeverity.HIGH, severity);

        // Also test bounds of HIGH (60-79)
        assertEquals(IncidentSeverity.HIGH, riskScoringService.calculateSeverity(79));
    }

    @Test
    @DisplayName("4. Score 80 maps to CRITICAL")
    void testScore80MapsToCritical() {
        IncidentSeverity severity = riskScoringService.calculateSeverity(80);
        assertEquals(IncidentSeverity.CRITICAL, severity);

        // Also test upper bound 100
        assertEquals(IncidentSeverity.CRITICAL, riskScoringService.calculateSeverity(100));
    }

    @Test
    @DisplayName("5. Brute-force contribution produces expected score (+50)")
    void testBruteForceContributionProducesExpectedScore() {
        DetectionResult bruteForce = new DetectionResult();
        bruteForce.setDetectionType(DetectionType.BRUTE_FORCE);
        bruteForce.setRiskContribution(50);

        RiskScoringService.RiskAssessment assessment = riskScoringService.calculateScore(bruteForce);

        assertEquals(50, assessment.getScore());
        assertEquals(IncidentSeverity.MEDIUM, assessment.getSeverity());
        assertEquals(1, assessment.getFactors().size());
        assertEquals("Brute-force behavior", assessment.getFactors().get(0).factor());
        assertEquals(50, assessment.getFactors().get(0).points());
    }

    @Test
    @DisplayName("6. Multiple distinct applicable factors are combined correctly")
    void testMultipleDistinctFactorsCombinedCorrectly() {
        // Brute force (50) + High failure rate context (20) + Excessive request activity context (15) = 85 -> CRITICAL
        DetectionResult bruteForce = new DetectionResult();
        bruteForce.setDetectionType(DetectionType.BRUTE_FORCE);

        RiskScoringService.RiskContext context = new RiskScoringService.RiskContext(true, true);
        RiskScoringService.RiskAssessment assessment = riskScoringService.calculateScore(List.of(bruteForce), context);

        assertEquals(85, assessment.getScore());
        assertEquals(IncidentSeverity.CRITICAL, assessment.getSeverity());
        assertEquals(3, assessment.getFactors().size());
        assertTrue(assessment.getReasons().contains("Brute-force behavior"));
        assertTrue(assessment.getReasons().contains("High authentication-failure rate"));
        assertTrue(assessment.getReasons().contains("Excessive request activity"));
    }

    @Test
    @DisplayName("7. Scores exceeding 100 are capped at 100")
    void testScoresExceeding100AreCappedAt100() {
        // Brute force (50) + High auth failure rate (20) + SQL injection (30) + API abuse (15) = 115 -> capped at 100
        DetectionResult bruteForce = new DetectionResult();
        bruteForce.setDetectionType(DetectionType.BRUTE_FORCE);

        DetectionResult sqli = new DetectionResult();
        sqli.setDetectionType(DetectionType.SQL_INJECTION_PATTERN);

        DetectionResult apiAbuse = new DetectionResult();
        apiAbuse.setDetectionType(DetectionType.API_ABUSE);

        RiskScoringService.RiskContext context = new RiskScoringService.RiskContext(true, false);
        RiskScoringService.RiskAssessment assessment = riskScoringService.calculateScore(
                List.of(bruteForce, sqli, apiAbuse), context
        );

        assertEquals(100, assessment.getScore());
        assertEquals(IncidentSeverity.CRITICAL, assessment.getSeverity());
    }

    @Test
    @DisplayName("8. Duplicate contributions are not counted repeatedly in one burst")
    void testDuplicateContributionsNotCountedRepeatedly() {
        DetectionResult bruteForce1 = new DetectionResult();
        bruteForce1.setDetectionType(DetectionType.BRUTE_FORCE);

        DetectionResult bruteForce2 = new DetectionResult();
        bruteForce2.setDetectionType(DetectionType.BRUTE_FORCE);

        RiskScoringService.RiskAssessment assessment = riskScoringService.calculateScore(
                List.of(bruteForce1, bruteForce2)
        );

        assertEquals(50, assessment.getScore());
        assertEquals(1, assessment.getFactors().size());
    }

    @Test
    @DisplayName("9. SQL injection-like detection alone contributes 30 points (MEDIUM)")
    void testSqlInjectionAloneContributes30Points() {
        DetectionResult sqli = new DetectionResult();
        sqli.setDetectionType(DetectionType.SQL_INJECTION_PATTERN);

        RiskScoringService.RiskAssessment assessment = riskScoringService.calculateScore(sqli);

        assertEquals(30, assessment.getScore());
        assertEquals(IncidentSeverity.MEDIUM, assessment.getSeverity());
        assertEquals(1, assessment.getFactors().size());
        assertEquals("SQL injection-like input detected", assessment.getFactors().get(0).factor());
        assertEquals(30, assessment.getFactors().get(0).points());
    }

    @Test
    @DisplayName("10. Risk explanations match the applied factors")
    void testRiskExplanationsMatchAppliedFactors() {
        DetectionResult sqli = new DetectionResult();
        sqli.setDetectionType(DetectionType.SQL_INJECTION_PATTERN);

        DetectionResult apiAbuse = new DetectionResult();
        apiAbuse.setDetectionType(DetectionType.API_ABUSE);

        RiskScoringService.RiskAssessment assessment = riskScoringService.calculateScore(List.of(sqli, apiAbuse));

        assertEquals(45, assessment.getScore());
        assertEquals(IncidentSeverity.MEDIUM, assessment.getSeverity());
        assertEquals(2, assessment.getReasons().size());
        assertEquals("SQL injection-like input detected", assessment.getReasons().get(0));
        assertEquals("Excessive API usage", assessment.getReasons().get(1));
    }

    @Test
    @DisplayName("Empty detections produce 0 score and LOW severity")
    void testEmptyDetectionsProduceZeroScore() {
        RiskScoringService.RiskAssessment assessment = riskScoringService.calculateScore(Collections.emptyList());
        assertEquals(0, assessment.getScore());
        assertEquals(IncidentSeverity.LOW, assessment.getSeverity());
        assertTrue(assessment.getFactors().isEmpty());
    }
}
