package com.sentinel.api.controller;

import com.sentinel.api.dto.event.ApiEventResponse;
import com.sentinel.api.entity.ApiEvent;
import com.sentinel.api.service.ApiEventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class ApiEventController {

    private final ApiEventService apiEventService;

    public ApiEventController(ApiEventService apiEventService) {
        this.apiEventService = apiEventService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<List<ApiEventResponse>> getAllEvents() {
        List<ApiEventResponse> events = apiEventService.getAllEvents().stream()
                .map(ApiEventResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(events);
    }

    @PostMapping
    public ResponseEntity<ApiEventResponse> ingestEvent(@RequestBody ApiEvent event) {
        ApiEvent saved = apiEventService.recordEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiEventResponse.fromEntity(saved));
    }
}
