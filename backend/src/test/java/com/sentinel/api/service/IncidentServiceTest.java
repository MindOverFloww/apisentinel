package com.sentinel.api.service;

import com.sentinel.api.detection.DetectionResult;
import com.sentinel.api.entity.DetectionType;
import com.sentinel.api.entity.Incident;
import com.sentinel.api.entity.IncidentSeverity;
import com.sentinel.api.entity.IncidentStatus;
import com.sentinel.api.repository.IncidentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IncidentServiceTest {

    @Mock
    private IncidentRepository incidentRepository;

    @InjectMocks
    private IncidentService incidentService;

    @Test
    @DisplayName("Process detection creates new incident when no recent incident exists")
    void testProcessDetectionCreatesNewIncident() {
        DetectionResult detection = new DetectionResult(
                DetectionType.SQL_INJECTION_PATTERN, "10.0.4.12", "/api/products", "GET",
                "SQL Injection Rule", 1L, 60, 30, "SQL injection-like pattern detected", "search=' OR 1=1"
        );

        RiskScoringService.RiskAssessment assessment = new RiskScoringService.RiskAssessment(
                30, IncidentSeverity.MEDIUM, List.of(new RiskScoringService.ScoreFactor("SQL injection-like input detected", 30))
        );

        when(incidentRepository.findTopBySourceIpAndTypeAndStatusAndCreatedAtAfterOrderByCreatedAtDesc(
                anyString(), any(DetectionType.class), any(IncidentStatus.class), any()))
                .thenReturn(Optional.empty());

        when(incidentRepository.save(any(Incident.class))).thenAnswer(invocation -> {
            Incident inc = invocation.getArgument(0);
            inc.setId(1L);
            return inc;
        });

        Incident incident = incidentService.processDetection(detection, assessment);

        assertNotNull(incident);
        assertEquals(DetectionType.SQL_INJECTION_PATTERN, incident.getType());
        assertEquals(30, incident.getRiskScore());
        assertEquals(IncidentSeverity.MEDIUM, incident.getSeverity());
        assertEquals(IncidentStatus.OPEN, incident.getStatus());
        verify(incidentRepository).save(any(Incident.class));
    }
}
