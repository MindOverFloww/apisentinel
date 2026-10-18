package com.sentinel.api.dto.rule;

import jakarta.validation.constraints.NotNull;

public class DetectionRuleEnabledRequest {

    @NotNull(message = "Enabled state is required")
    private Boolean enabled;

    public DetectionRuleEnabledRequest() {
    }

    public DetectionRuleEnabledRequest(Boolean enabled) {
        this.enabled = enabled;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}
