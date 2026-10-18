package com.sentinel.api.dto.incident;

import com.sentinel.api.entity.DetectionType;
import com.sentinel.api.entity.Incident;
import com.sentinel.api.entity.IncidentSeverity;
import com.sentinel.api.entity.IncidentStatus;

import java.time.LocalDateTime;

public class IncidentResponse {

    private Long id;
    private DetectionType type;
    private String title;
    private Integer riskScore;
    private IncidentSeverity severity;
    private String sourceIp;
    private String endpoint;
    private String method;
    private String description;
    private String detectionRule;
    private IncidentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer requestCount;
    private String samplePayload;
    private String factors;

    public IncidentResponse() {
    }

    public static IncidentResponse fromEntity(Incident incident) {
        if (incident == null) return null;
        IncidentResponse resp = new IncidentResponse();
        resp.setId(incident.getId());
        resp.setType(incident.getType());
        resp.setTitle(incident.getTitle());
        resp.setRiskScore(incident.getRiskScore());
        resp.setSeverity(incident.getSeverity());
        resp.setSourceIp(incident.getSourceIp());
        resp.setEndpoint(incident.getEndpoint());
        resp.setMethod(incident.getMethod());
        resp.setDescription(incident.getDescription());
        resp.setDetectionRule(incident.getDetectionRule());
        resp.setStatus(incident.getStatus());
        resp.setCreatedAt(incident.getCreatedAt());
        resp.setUpdatedAt(incident.getUpdatedAt());
        resp.setRequestCount(incident.getRequestCount());
        resp.setSamplePayload(incident.getSamplePayload());
        resp.setFactors(incident.getFactors());
        return resp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DetectionType getType() {
        return type;
    }

    public void setType(DetectionType type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public IncidentSeverity getSeverity() {
        return severity;
    }

    public void setSeverity(IncidentSeverity severity) {
        this.severity = severity;
    }

    public String getSourceIp() {
        return sourceIp;
    }

    public void setSourceIp(String sourceIp) {
        this.sourceIp = sourceIp;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDetectionRule() {
        return detectionRule;
    }

    public void setDetectionRule(String detectionRule) {
        this.detectionRule = detectionRule;
    }

    public IncidentStatus getStatus() {
        return status;
    }

    public void setStatus(IncidentStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Integer getRequestCount() {
        return requestCount;
    }

    public void setRequestCount(Integer requestCount) {
        this.requestCount = requestCount;
    }

    public String getSamplePayload() {
        return samplePayload;
    }

    public void setSamplePayload(String samplePayload) {
        this.samplePayload = samplePayload;
    }

    public String getFactors() {
        return factors;
    }

    public void setFactors(String factors) {
        this.factors = factors;
    }
}
