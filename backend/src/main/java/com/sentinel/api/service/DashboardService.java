package com.sentinel.api.service;

import com.sentinel.api.dto.dashboard.DashboardSummaryResponse;
import com.sentinel.api.entity.Incident;
import com.sentinel.api.entity.IncidentSeverity;
import com.sentinel.api.entity.IncidentStatus;
import com.sentinel.api.repository.ApiEventRepository;
import com.sentinel.api.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final ApiEventRepository apiEventRepository;
    private final IncidentRepository incidentRepository;

    public DashboardService(ApiEventRepository apiEventRepository, IncidentRepository incidentRepository) {
        this.apiEventRepository = apiEventRepository;
        this.incidentRepository = incidentRepository;
    }

    public DashboardSummaryResponse getSummary() {
        long totalEvents = apiEventRepository.count();
        List<Incident> incidents = incidentRepository.findAll();
        long totalIncidents = incidents.size();
        long openIncidents = incidents.stream().filter(i -> i.getStatus() == IncidentStatus.OPEN).count();

        long critical = incidents.stream().filter(i -> i.getSeverity() == IncidentSeverity.CRITICAL).count();
        long high = incidents.stream().filter(i -> i.getSeverity() == IncidentSeverity.HIGH).count();
        long medium = incidents.stream().filter(i -> i.getSeverity() == IncidentSeverity.MEDIUM).count();
        long low = incidents.stream().filter(i -> i.getSeverity() == IncidentSeverity.LOW).count();

        return new DashboardSummaryResponse(
                totalEvents,
                totalIncidents,
                openIncidents,
                critical,
                high,
                medium,
                low
        );
    }
}
