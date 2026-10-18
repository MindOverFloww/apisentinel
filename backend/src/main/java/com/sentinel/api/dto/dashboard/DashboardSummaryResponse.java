package com.sentinel.api.dto.dashboard;

public class DashboardSummaryResponse {

    private long totalEvents;
    private long totalIncidents;
    private long openIncidents;
    private long criticalIncidents;
    private long highIncidents;
    private long mediumIncidents;
    private long lowIncidents;

    public DashboardSummaryResponse() {
    }

    public DashboardSummaryResponse(long totalEvents, long totalIncidents, long openIncidents,
                                    long criticalIncidents, long highIncidents, long mediumIncidents, long lowIncidents) {
        this.totalEvents = totalEvents;
        this.totalIncidents = totalIncidents;
        this.openIncidents = openIncidents;
        this.criticalIncidents = criticalIncidents;
        this.highIncidents = highIncidents;
        this.mediumIncidents = mediumIncidents;
        this.lowIncidents = lowIncidents;
    }

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public long getTotalIncidents() {
        return totalIncidents;
    }

    public void setTotalIncidents(long totalIncidents) {
        this.totalIncidents = totalIncidents;
    }

    public long getOpenIncidents() {
        return openIncidents;
    }

    public void setOpenIncidents(long openIncidents) {
        this.openIncidents = openIncidents;
    }

    public long getCriticalIncidents() {
        return criticalIncidents;
    }

    public void setCriticalIncidents(long criticalIncidents) {
        this.criticalIncidents = criticalIncidents;
    }

    public long getHighIncidents() {
        return highIncidents;
    }

    public void setHighIncidents(long highIncidents) {
        this.highIncidents = highIncidents;
    }

    public long getMediumIncidents() {
        return mediumIncidents;
    }

    public void setMediumIncidents(long mediumIncidents) {
        this.mediumIncidents = mediumIncidents;
    }

    public long getLowIncidents() {
        return lowIncidents;
    }

    public void setLowIncidents(long lowIncidents) {
        this.lowIncidents = lowIncidents;
    }
}
