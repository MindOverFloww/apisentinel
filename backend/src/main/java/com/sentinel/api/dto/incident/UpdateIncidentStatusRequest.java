package com.sentinel.api.dto.incident;

import com.sentinel.api.entity.IncidentStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateIncidentStatusRequest {

    @NotNull(message = "Incident status is required")
    private IncidentStatus status;

    public UpdateIncidentStatusRequest() {
    }

    public UpdateIncidentStatusRequest(IncidentStatus status) {
        this.status = status;
    }

    public IncidentStatus getStatus() {
        return status;
    }

    public void setStatus(IncidentStatus status) {
        this.status = status;
    }
}
