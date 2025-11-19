package com.aetherisland.repository;

import com.aetherisland.entity.ActionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActionLogRepository extends JpaRepository<ActionLog, String> {
    List<ActionLog> findBySpiritlingIdOrderByCreatedAtDesc(String spiritlingId);
}

