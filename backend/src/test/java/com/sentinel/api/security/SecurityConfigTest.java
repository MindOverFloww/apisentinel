package com.sentinel.api.security;

import com.sentinel.api.config.SecurityConfig;
import com.sentinel.api.controller.DetectionRuleController;
import com.sentinel.api.dto.rule.CreateDetectionRuleRequest;
import com.sentinel.api.dto.rule.DetectionRuleEnabledRequest;
import com.sentinel.api.dto.rule.UpdateDetectionRuleRequest;
import com.sentinel.api.entity.DetectionRule;
import com.sentinel.api.entity.DetectionType;
import com.sentinel.api.repository.DetectionRuleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DetectionRuleController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private DetectionRuleRepository ruleRepository;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService userDetailsService;

    @Test
    @DisplayName("Unauthenticated request to /api/rules is rejected (401 or 403)")
    void testUnauthenticatedAccessRejected() throws Exception {
        mockMvc.perform(get("/api/rules"))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assertTrue(status == 401 || status == 403, "Expected 401 or 403 but got " + status);
                });
    }

    @Test
    @WithMockUser(roles = "VIEWER")
    @DisplayName("VIEWER role can view detection rules (GET /api/rules)")
    void testViewerCanViewRules() throws Exception {
        when(ruleRepository.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/rules"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ANALYST")
    @DisplayName("ANALYST role can view detection rules (GET /api/rules)")
    void testAnalystCanViewRules() throws Exception {
        when(ruleRepository.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/rules"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ANALYST")
    @DisplayName("ANALYST role cannot create rules (POST /api/rules -> 403 Forbidden)")
    void testAnalystCannotCreateRules() throws Exception {
        CreateDetectionRuleRequest request = new CreateDetectionRuleRequest(
                "New Rule", DetectionType.BRUTE_FORCE, "Desc", 10, 60, true
        );

        mockMvc.perform(post("/api/rules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "VIEWER")
    @DisplayName("VIEWER role cannot modify rules (PUT /api/rules/1 -> 403 Forbidden)")
    void testViewerCannotModifyRules() throws Exception {
        UpdateDetectionRuleRequest request = new UpdateDetectionRuleRequest(
                "Updated Rule", "Desc", 10, 60, true
        );

        mockMvc.perform(put("/api/rules/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("ADMIN role can create detection rules (POST /api/rules -> 201 Created)")
    void testAdminCanCreateRules() throws Exception {
        CreateDetectionRuleRequest request = new CreateDetectionRuleRequest(
                "Custom Rule", DetectionType.BRUTE_FORCE, "Desc", 10, 60, true
        );

        DetectionRule saved = new DetectionRule("Custom Rule", DetectionType.BRUTE_FORCE, "Desc", 10, 60, true);
        saved.setId(1L);

        when(ruleRepository.existsByName("Custom Rule")).thenReturn(false);
        when(ruleRepository.existsByType(DetectionType.BRUTE_FORCE)).thenReturn(false);
        when(ruleRepository.save(any(DetectionRule.class))).thenReturn(saved);

        mockMvc.perform(post("/api/rules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("ADMIN role can toggle rule enabled state (PATCH /api/rules/1/enabled -> 200 OK)")
    void testAdminCanToggleRule() throws Exception {
        DetectionRule rule = new DetectionRule("Rule 1", DetectionType.BRUTE_FORCE, "Desc", 5, 60, true);
        rule.setId(1L);

        when(ruleRepository.findById(1L)).thenReturn(Optional.of(rule));
        when(ruleRepository.save(any(DetectionRule.class))).thenReturn(rule);

        DetectionRuleEnabledRequest request = new DetectionRuleEnabledRequest(false);

        mockMvc.perform(patch("/api/rules/1/enabled")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
}
