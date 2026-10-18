package com.sentinel.api.controller;

import com.sentinel.api.entity.ApiEvent;
import com.sentinel.api.security.JwtAuthenticationFilter;
import com.sentinel.api.security.JwtService;
import com.sentinel.api.service.ApiEventService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DemoController.class)
@AutoConfigureMockMvc(addFilters = false)
class DemoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ApiEventService apiEventService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private JwtService jwtService;

    @Test
    @DisplayName("Demo login endpoint returns 401 on bad credentials and records event")
    void testDemoLoginUnauthorized() throws Exception {
        mockMvc.perform(post("/api/demo/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\": \"admin\", \"password\": \"wrongpass\"}"))
                .andExpect(status().isUnauthorized());

        verify(apiEventService).recordEvent(any(ApiEvent.class));
    }

    @Test
    @DisplayName("Demo products endpoint records request event")
    void testDemoProducts() throws Exception {
        mockMvc.perform(get("/api/demo/products?search=' OR '1'='1"))
                .andExpect(status().isOk());

        verify(apiEventService).recordEvent(any(ApiEvent.class));
    }
}
