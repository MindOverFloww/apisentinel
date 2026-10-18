package com.sentinel.api.controller;

import com.sentinel.api.dto.incident.IncidentResponse;
import com.sentinel.api.dto.incident.UpdateIncidentStatusRequest;
import com.sentinel.api.entity.Incident;
import com.sentinel.api.entity.IncidentStatus;
import com.sentinel.api.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<List<IncidentResponse>> getIncidents(@RequestParam(required = false) IncidentStatus status) {
        List<Incident> incidents = (status != null)
                ? incidentService.getIncidentsByStatus(status)
                : incidentService.getAllIncidents();

        List<IncidentResponse> responses = incidents.stream()
                .map(IncidentResponse::fromEntity)
                .toList();

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<IncidentResponse> getIncidentById(@PathVariable Long id) {
        Incident incident = incidentService.getIncidentById(id);
        return ResponseEntity.ok(IncidentResponse.fromEntity(incident));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST')")
    public ResponseEntity<IncidentResponse> updateStatus(@PathVariable Long id,
                                                         @Valid @RequestBody UpdateIncidentStatusRequest request) {
        Incident updated = incidentService.updateIncidentStatus(id, request.getStatus());
        return ResponseEntity.ok(IncidentResponse.fromEntity(updated));
    }
}
