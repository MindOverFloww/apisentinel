package com.sentinel.api.detection;

import com.sentinel.api.entity.DetectionType;

import java.time.LocalDateTime;

public class DetectionResult {

    private DetectionType detectionType;
    private String sourceIp;
    private String endpoint;
    private String method;
    private LocalDateTime detectedAt;
    private String ruleName;
    private long eventCount;
    private int timeWindowSeconds;
    private int riskContribution;
    private String reason;
    private String samplePayload;

    public DetectionResult() {
        this.detectedAt = LocalDateTime.now();
    }

    public DetectionResult(DetectionType detectionType, String sourceIp, String endpoint, String method,
                           String ruleName, long eventCount, int timeWindowSeconds,
                           int riskContribution, String reason, String samplePayload) {
        this.detectionType = detectionType;
        this.sourceIp = sourceIp;
        this.endpoint = endpoint;
        this.method = method;
        this.detectedAt = LocalDateTime.now();
        this.ruleName = ruleName;
        this.eventCount = eventCount;
        this.timeWindowSeconds = timeWindowSeconds;
        this.riskContribution = riskContribution;
        this.reason = reason;
        this.samplePayload = samplePayload;
    }

    public DetectionType getDetectionType() {
        return detectionType;
    }

    public void setDetectionType(DetectionType detectionType) {
        this.detectionType = detectionType;
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

    public LocalDateTime getDetectedAt() {
        return detectedAt;
    }

    public void setDetectedAt(LocalDateTime detectedAt) {
        this.detectedAt = detectedAt;
    }

    public String getRuleName() {
        return ruleName;
    }

    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
    }

    public long getEventCount() {
        return eventCount;
    }

    public void setEventCount(long eventCount) {
        this.eventCount = eventCount;
    }

    public int getTimeWindowSeconds() {
        return timeWindowSeconds;
    }

    public void setTimeWindowSeconds(int timeWindowSeconds) {
        this.timeWindowSeconds = timeWindowSeconds;
    }

    public int getRiskContribution() {
        return riskContribution;
    }

    public void setRiskContribution(int riskContribution) {
        this.riskContribution = riskContribution;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getSamplePayload() {
        return samplePayload;
    }

    public void setSamplePayload(String samplePayload) {
        this.samplePayload = samplePayload;
    }

    @Override
    public String toString() {
        return "DetectionResult{" +
                "detectionType=" + detectionType +
                ", sourceIp='" + sourceIp + '\'' +
                ", endpoint='" + endpoint + '\'' +
                ", ruleName='" + ruleName + '\'' +
                ", eventCount=" + eventCount +
                ", riskContribution=" + riskContribution +
                ", reason='" + reason + '\'' +
                '}';
    }
}
