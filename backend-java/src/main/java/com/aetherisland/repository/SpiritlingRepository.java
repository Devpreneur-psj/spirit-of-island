package com.aetherisland.repository;

import com.aetherisland.entity.Spiritling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpiritlingRepository extends JpaRepository<Spiritling, String> {
    List<Spiritling> findByUserId(String userId);
    long countByUserId(String userId);
}

