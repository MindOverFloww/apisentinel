package com.sentinel.api.controller;

import com.sentinel.api.dto.rule.CreateDetectionRuleRequest;
import com.sentinel.api.dto.rule.DetectionRuleEnabledRequest;
import com.sentinel.api.dto.rule.DetectionRuleResponse;
import com.sentinel.api.dto.rule.UpdateDetectionRuleRequest;
import com.sentinel.api.entity.DetectionRule;
import com.sentinel.api.exception.ResourceNotFoundException;
import com.sentinel.api.repository.DetectionRuleRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rules")
public class DetectionRuleController {

    private final DetectionRuleRepository ruleRepository;

    public DetectionRuleController(DetectionRuleRepository ruleRepository) {
        this.ruleRepository = ruleRepository;
    }

    /**
     * List all detection rules.
     * Allowed: ADMIN, ANALYST, VIEWER
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<List<DetectionRuleResponse>> getAllRules() {
        List<DetectionRuleResponse> rules = ruleRepository.findAll().stream()
                .map(DetectionRuleResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(rules);
    }

    /**
     * Retrieve a detection rule by ID.
     * Allowed: ADMIN, ANALYST, VIEWER
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<DetectionRuleResponse> getRuleById(@PathVariable Long id) {
        DetectionRule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found with id: " + id));
        return ResponseEntity.ok(DetectionRuleResponse.fromEntity(rule));
    }

    /**
     * Create a new detection rule.
     * Allowed: ADMIN only
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<DetectionRuleResponse> createRule(@Valid @RequestBody CreateDetectionRuleRequest request) {
        if (ruleRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("A rule with name '" + request.getName() + "' already exists");
        }
        if (ruleRepository.existsByType(request.getType())) {
            throw new IllegalArgumentException("A rule for detection type '" + request.getType() + "' already exists");
        }

        DetectionRule rule = new DetectionRule(
                request.getName(),
                request.getType(),
                request.getDescription(),
                request.getThreshold(),
                request.getTimeWindow(),
                request.getEnabled()
        );

        DetectionRule saved = ruleRepository.save(rule);
        return ResponseEntity.status(HttpStatus.CREATED).body(DetectionRuleResponse.fromEntity(saved));
    }

    /**
     * Update an existing detection rule.
     * Allowed: ADMIN only
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<DetectionRuleResponse> updateRule(@PathVariable Long id,
                                                            @Valid @RequestBody UpdateDetectionRuleRequest request) {
        DetectionRule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found with id: " + id));

        rule.setName(request.getName());
        rule.setDescription(request.getDescription());
        rule.setThreshold(request.getThreshold());
        rule.setTimeWindow(request.getTimeWindow());
        rule.setEnabled(request.getEnabled());

        DetectionRule updated = ruleRepository.save(rule);
        return ResponseEntity.ok(DetectionRuleResponse.fromEntity(updated));
    }

    /**
     * Toggle or update enabled state for a rule.
     * Allowed: ADMIN only
     */
    @PatchMapping("/{id}/enabled")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<DetectionRuleResponse> updateRuleEnabled(@PathVariable Long id,
                                                                   @Valid @RequestBody DetectionRuleEnabledRequest request) {
        DetectionRule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found with id: " + id));

        rule.setEnabled(request.getEnabled());
        DetectionRule updated = ruleRepository.save(rule);
        return ResponseEntity.ok(DetectionRuleResponse.fromEntity(updated));
    }
}
