package com.sentinel.api.service;

import com.sentinel.api.detection.DetectionResult;
import com.sentinel.api.entity.ApiEvent;
import com.sentinel.api.repository.ApiEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApiEventService {

    private static final Logger log = LoggerFactory.getLogger(ApiEventService.class);

    private final ApiEventRepository apiEventRepository;
    private final DetectionService detectionService;

    public ApiEventService(ApiEventRepository apiEventRepository, DetectionService detectionService) {
        this.apiEventRepository = apiEventRepository;
        this.detectionService = detectionService;
    }

    /**
     * Record an incoming API event and pass it to the Detection Engine for real-time security analysis.
     */
    @Transactional
    public ApiEvent recordEvent(ApiEvent event) {
        if (event.getTimestamp() == null) {
            event.setTimestamp(LocalDateTime.now());
        }
        if (event.getResponseTime() == null) {
            event.setResponseTime(15L);
        }
        if (event.getRequestSize() == null) {
            event.setRequestSize(128L);
        }
        if (event.getResponseSize() == null) {
            event.setResponseSize(256L);
        }

        // Persist the event first so detection rules can accurately query the event stream
        ApiEvent savedEvent = apiEventRepository.save(event);

        try {
            // Trigger rule-based detection engine
            List<DetectionResult> detections = detectionService.evaluateEvent(savedEvent);

            if (!detections.isEmpty()) {
                log.info("API Event ID {} triggered {} detection(s)", savedEvent.getId(), detections.size());
                savedEvent.setRiskFlag(true);
                savedEvent.setRiskType(detections.get(0).getDetectionType());
                savedEvent = apiEventRepository.save(savedEvent);
            }
        } catch (Exception e) {
            log.error("Detection evaluation failed for event ID {}: {}", savedEvent.getId(), e.getMessage(), e);
        }

        return savedEvent;
    }

    public List<ApiEvent> getAllEvents() {
        return apiEventRepository.findAll();
    }
}
