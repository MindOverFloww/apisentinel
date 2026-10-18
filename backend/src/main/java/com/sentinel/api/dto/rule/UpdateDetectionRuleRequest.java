package com.sentinel.api.dto.rule;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UpdateDetectionRuleRequest {

    @NotBlank(message = "Rule name must not be blank")
    private String name;

    private String description;

    @NotNull(message = "Threshold is required")
    @Min(value = 1, message = "Threshold must be positive")
    private Integer threshold;

    @NotNull(message = "Time window is required")
    @Min(value = 1, message = "Time window must be positive")
    private Integer timeWindow;

    @NotNull(message = "Enabled state must be a valid boolean")
    private Boolean enabled;

    public UpdateDetectionRuleRequest() {
    }

    public UpdateDetectionRuleRequest(String name, String description, Integer threshold,
                                      Integer timeWindow, Boolean enabled) {
        this.name = name;
        this.description = description;
        this.threshold = threshold;
        this.timeWindow = timeWindow;
        this.enabled = enabled;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
