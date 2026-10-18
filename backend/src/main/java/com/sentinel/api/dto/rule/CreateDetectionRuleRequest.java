package com.sentinel.api.dto.rule;

import com.sentinel.api.entity.DetectionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateDetectionRuleRequest {

    @NotBlank(message = "Rule name must not be blank")
    private String name;

    @NotNull(message = "Detection type must be valid")
    private DetectionType type;

    private String description;

    @NotNull(message = "Threshold is required")
    @Min(value = 1, message = "Threshold must be positive")
    private Integer threshold;

    @NotNull(message = "Time window is required")
    @Min(value = 1, message = "Time window must be positive")
    private Integer timeWindow;

    private Boolean enabled = true;

    public CreateDetectionRuleRequest() {
    }

    public CreateDetectionRuleRequest(String name, DetectionType type, String description,
                                      Integer threshold, Integer timeWindow, Boolean enabled) {
        this.name = name;
        this.type = type;
        this.description = description;
        this.threshold = threshold;
        this.timeWindow = timeWindow;
        this.enabled = enabled != null ? enabled : true;
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
