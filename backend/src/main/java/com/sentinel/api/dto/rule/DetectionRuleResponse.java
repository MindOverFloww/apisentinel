package com.sentinel.api.dto.rule;

import com.sentinel.api.entity.DetectionRule;
import com.sentinel.api.entity.DetectionType;

public class DetectionRuleResponse {

    private Long id;
    private String name;
    private DetectionType type;
    private String description;
    private Integer threshold;
    private Integer timeWindow;
    private Boolean enabled;

    public DetectionRuleResponse() {
    }

    public DetectionRuleResponse(Long id, String name, DetectionType type, String description,
                                 Integer threshold, Integer timeWindow, Boolean enabled) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.threshold = threshold;
        this.timeWindow = timeWindow;
        this.enabled = enabled;
    }

    public static DetectionRuleResponse fromEntity(DetectionRule rule) {
        if (rule == null) {
            return null;
        }
        return new DetectionRuleResponse(
                rule.getId(),
                rule.getName(),
                rule.getType(),
                rule.getDescription(),
                rule.getThreshold(),
                rule.getTimeWindow(),
                rule.getEnabled()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DetectionType getType() {
        return type;
    }

    public void setType(DetectionType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getThreshold() {
        return threshold;
    }

    public void setThreshold(Integer threshold) {
        this.threshold = threshold;
    }

    public Integer getTimeWindow() {
        return timeWindow;
    }

    public void setTimeWindow(Integer timeWindow) {
        this.timeWindow = timeWindow;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}
