package com.sentinel.api.repository;

import com.sentinel.api.entity.DetectionType;
import com.sentinel.api.entity.Incident;
import com.sentinel.api.entity.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {

    List<Incident> findByStatus(IncidentStatus status);

    List<Incident> findBySourceIp(String sourceIp);

    Optional<Incident> findTopBySourceIpAndTypeAndStatusOrderByCreatedAtDesc(
            String sourceIp, DetectionType type, IncidentStatus status);

    Optional<Incident> findTopBySourceIpAndTypeAndStatusAndCreatedAtAfterOrderByCreatedAtDesc(
            String sourceIp, DetectionType type, IncidentStatus status, LocalDateTime since);

    long countByStatus(IncidentStatus status);
}
