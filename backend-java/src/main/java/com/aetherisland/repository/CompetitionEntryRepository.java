package com.aetherisland.repository;

import com.aetherisland.entity.CompetitionEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompetitionEntryRepository extends JpaRepository<CompetitionEntry, String> {
    List<CompetitionEntry> findByCompetitionIdOrderByScoreDesc(String competitionId);
    
    Optional<CompetitionEntry> findByCompetitionIdAndSpiritlingId(String competitionId, String spiritlingId);
    
    @Query("SELECT ce FROM CompetitionEntry ce WHERE ce.competitionId = :competitionId ORDER BY ce.score DESC")
    List<CompetitionEntry> findTop10ByCompetitionIdOrderByScoreDesc(@Param("competitionId") String competitionId);
}

