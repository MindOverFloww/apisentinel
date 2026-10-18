package com.sentinel.api.repository;

import com.sentinel.api.entity.DetectionRule;
import com.sentinel.api.entity.DetectionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DetectionRuleRepository extends JpaRepository<DetectionRule, Long> {

    Optional<DetectionRule> findByType(DetectionType type);

    Optional<DetectionRule> findByTypeAndEnabledTrue(DetectionType type);

    Optional<DetectionRule> findByName(String name);

    List<DetectionRule> findByEnabledTrue();

    boolean existsByType(DetectionType type);

    boolean existsByName(String name);
}
