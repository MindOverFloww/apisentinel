package com.sentinel.api.service;

import com.sentinel.api.detection.DetectionResult;
import com.sentinel.api.entity.ApiEvent;
import com.sentinel.api.entity.DetectionType;
import com.sentinel.api.repository.ApiEventRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApiEventServiceTest {

    @Mock
    private ApiEventRepository apiEventRepository;

    @Mock
    private DetectionService detectionService;

    @InjectMocks
    private ApiEventService apiEventService;

    @Test
    @DisplayName("Recording API event invokes detection engine and updates risk flag when detected")
    void testRecordEventTriggersDetection() {
        ApiEvent event = new ApiEvent("POST", "/api/auth/login", 401, "192.168.1.100");
        when(apiEventRepository.save(any(ApiEvent.class))).thenAnswer(invocation -> invocation.getArgument(0));

        DetectionResult detection = new DetectionResult();
        detection.setDetectionType(DetectionType.BRUTE_FORCE);
        when(detectionService.evaluateEvent(any(ApiEvent.class))).thenReturn(List.of(detection));

        ApiEvent saved = apiEventService.recordEvent(event);

        assertNotNull(saved);
        assertTrue(saved.getRiskFlag());
        assertEquals(DetectionType.BRUTE_FORCE, saved.getRiskType());
        verify(detectionService).evaluateEvent(any(ApiEvent.class));
    }
}
