package com.sentinel.api.service;

import com.sentinel.api.detection.DetectionResult;
import com.sentinel.api.entity.DetectionType;
import com.sentinel.api.entity.Incident;
import com.sentinel.api.entity.IncidentStatus;
import com.sentinel.api.exception.ResourceNotFoundException;
import com.sentinel.api.repository.IncidentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class IncidentService {

    private static final Logger log = LoggerFactory.getLogger(IncidentService.class);
    private static final int COOLDOWN_SECONDS = 60; // 60 seconds burst deduplication window

    private final IncidentRepository incidentRepository;

    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id: " + id));
    }

    public List<Incident> getIncidentsByStatus(IncidentStatus status) {
        return incidentRepository.findByStatus(status);
    }

    @Transactional
    public Incident updateIncidentStatus(Long id, IncidentStatus newStatus) {
        Incident incident = getIncidentById(id);
        incident.setStatus(newStatus);
        incident.setUpdatedAt(LocalDateTime.now());
        return incidentRepository.save(incident);
    }

    /**
     * Create or update an incident based on a detection result and its risk assessment.
     * Prevents duplicate incidents during the same attack burst within a cooldown window.
     */
    @Transactional
    public Incident processDetection(DetectionResult detection, RiskScoringService.RiskAssessment assessment) {
        if (detection == null || assessment == null) {
            return null;
        }

        LocalDateTime cooldownBoundary = LocalDateTime.now().minusSeconds(COOLDOWN_SECONDS);

        // Check for existing OPEN incident for same source IP and detection type within cooldown
        Optional<Incident> existingIncidentOpt = incidentRepository
                .findTopBySourceIpAndTypeAndStatusAndCreatedAtAfterOrderByCreatedAtDesc(
                        detection.getSourceIp(),
                        detection.getDetectionType(),
                        IncidentStatus.OPEN,
                        cooldownBoundary
                );

        if (existingIncidentOpt.isPresent()) {
            Incident incident = existingIncidentOpt.get();
            log.info("Deduplicating detection in existing incident ID {}: IP={}, Type={}",
                    incident.getId(), detection.getSourceIp(), detection.getDetectionType());

            // Increment request/event count and update timestamps
            incident.setRequestCount((incident.getRequestCount() != null ? incident.getRequestCount() : 1) + 1);
            if (assessment.getScore() > incident.getRiskScore()) {
                incident.setRiskScore(assessment.getScore());
                incident.setSeverity(assessment.getSeverity());
            }
            incident.setUpdatedAt(LocalDateTime.now());
            if (detection.getSamplePayload() != null && !detection.getSamplePayload().isBlank()) {
                incident.setSamplePayload(detection.getSamplePayload());
            }
            return incidentRepository.save(incident);
        }

        // Create a new incident
        Incident incident = new Incident();
        incident.setType(detection.getDetectionType());
        incident.setTitle(buildIncidentTitle(detection.getDetectionType(), detection.getRuleName()));
        incident.setRiskScore(assessment.getScore());
        incident.setSeverity(assessment.getSeverity());
        incident.setSourceIp(detection.getSourceIp());
        incident.setEndpoint(detection.getEndpoint());
        incident.setMethod(detection.getMethod());
        incident.setDescription(detection.getReason());
        incident.setDetectionRule(detection.getRuleName());
        incident.setStatus(IncidentStatus.OPEN);
        incident.setRequestCount(detection.getEventCount() > 0 ? (int) detection.getEventCount() : 1);
        incident.setSamplePayload(detection.getSamplePayload());
        incident.setFactors(String.join("; ", assessment.getReasons()));
        incident.setCreatedAt(LocalDateTime.now());
        incident.setUpdatedAt(LocalDateTime.now());

        Incident saved = incidentRepository.save(incident);
        log.warn("New incident created ID {}: IP={}, Type={}, Severity={}, Score={}",
                saved.getId(), saved.getSourceIp(), saved.getType(), saved.getSeverity(), saved.getRiskScore());
        return saved;
    }

    private String buildIncidentTitle(DetectionType type, String ruleName) {
        if (type == null) {
            return ruleName != null ? ruleName : "Security Incident";
        }
        return switch (type) {
            case BRUTE_FORCE -> "Excessive Login Failures (Brute-Force)";
            case API_ABUSE -> "API Rate Flooding / Excessive Volume";
            case SQL_INJECTION_PATTERN -> "SQL Injection-Like Input Pattern";
        };
    }
}
