package com.sentinel.api.repository;

import com.sentinel.api.entity.ApiEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ApiEventRepository extends JpaRepository<ApiEvent, Long> {

    List<ApiEvent> findBySourceIpAndTimestampAfter(String sourceIp, LocalDateTime since);

    @Query("SELECT COUNT(e) FROM ApiEvent e WHERE e.sourceIp = :sourceIp AND e.timestamp >= :since")
    long countRecentRequests(@Param("sourceIp") String sourceIp, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(e) FROM ApiEvent e WHERE e.sourceIp = :sourceIp AND e.timestamp >= :since " +
           "AND LOWER(e.endpoint) NOT LIKE '%/actuator%' AND LOWER(e.endpoint) NOT LIKE '%/health%'")
    long countRecentRequestsExcludingHealth(@Param("sourceIp") String sourceIp, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(e) FROM ApiEvent e WHERE e.sourceIp = :sourceIp AND e.statusCode = :statusCode " +
           "AND (LOWER(e.endpoint) LIKE '%/login%' OR LOWER(e.endpoint) LIKE '%/auth%') AND e.timestamp >= :since")
    long countFailedLoginAttempts(@Param("sourceIp") String sourceIp,
                                  @Param("statusCode") Integer statusCode,
                                  @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(e) FROM ApiEvent e WHERE e.sourceIp = :sourceIp " +
           "AND (LOWER(e.endpoint) LIKE '%/login%' OR LOWER(e.endpoint) LIKE '%/auth%') AND e.timestamp >= :since")
    long countTotalLoginAttempts(@Param("sourceIp") String sourceIp, @Param("since") LocalDateTime since);
}
