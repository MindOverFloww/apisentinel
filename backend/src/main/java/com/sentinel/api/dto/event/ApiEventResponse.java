package com.sentinel.api.dto.event;

import com.sentinel.api.entity.ApiEvent;
import com.sentinel.api.entity.DetectionType;

import java.time.LocalDateTime;

public class ApiEventResponse {

    private Long id;
    private LocalDateTime timestamp;
    private String method;
    private String endpoint;
    private Integer statusCode;
    private Long responseTime;
    private Long requestSize;
    private Long responseSize;
    private String sourceIp;
    private String userAgent;
    private Boolean riskFlag;
    private DetectionType riskType;

    public ApiEventResponse() {
    }

    public static ApiEventResponse fromEntity(ApiEvent event) {
        if (event == null) return null;
        ApiEventResponse resp = new ApiEventResponse();
        resp.setId(event.getId());
        resp.setTimestamp(event.getTimestamp());
        resp.setMethod(event.getMethod());
        resp.setEndpoint(event.getEndpoint());
        resp.setStatusCode(event.getStatusCode());
        resp.setResponseTime(event.getResponseTime());
        resp.setRequestSize(event.getRequestSize());
        resp.setResponseSize(event.getResponseSize());
        resp.setSourceIp(event.getSourceIp());
        resp.setUserAgent(event.getUserAgent());
        resp.setRiskFlag(event.getRiskFlag());
        resp.setRiskType(event.getRiskType());
        return resp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public Integer getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(Integer statusCode) {
        this.statusCode = statusCode;
    }

    public Long getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(Long responseTime) {
        this.responseTime = responseTime;
    }

    public Long getRequestSize() {
        return requestSize;
    }

    public void setRequestSize(Long requestSize) {
        this.requestSize = requestSize;
    }

    public Long getResponseSize() {
        return responseSize;
    }

    public void setResponseSize(Long responseSize) {
        this.responseSize = responseSize;
    }

    public String getSourceIp() {
        return sourceIp;
    }

    public void setSourceIp(String sourceIp) {
        this.sourceIp = sourceIp;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public Boolean getRiskFlag() {
        return riskFlag;
    }

    public void setRiskFlag(Boolean riskFlag) {
        this.riskFlag = riskFlag;
    }

    public DetectionType getRiskType() {
        return riskType;
    }

    public void setRiskType(DetectionType riskType) {
        this.riskType = riskType;
    }
}
