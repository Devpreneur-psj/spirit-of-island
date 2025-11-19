package com.aetherisland.controller;

import com.aetherisland.dto.CompetitionResponse;
import com.aetherisland.entity.Competition;
import com.aetherisland.entity.CompetitionEntry;
import com.aetherisland.entity.Spiritling;
import com.aetherisland.exception.ApiException;
import com.aetherisland.repository.CompetitionEntryRepository;
import com.aetherisland.repository.CompetitionRepository;
import com.aetherisland.repository.SpiritlingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/competitions")
public class CompetitionController {
    private final CompetitionRepository competitionRepository;
    private final CompetitionEntryRepository competitionEntryRepository;
    private final SpiritlingRepository spiritlingRepository;
    
    public CompetitionController(CompetitionRepository competitionRepository,
                                CompetitionEntryRepository competitionEntryRepository,
                                SpiritlingRepository spiritlingRepository) {
        this.competitionRepository = competitionRepository;
        this.competitionEntryRepository = competitionEntryRepository;
        this.spiritlingRepository = spiritlingRepository;
    }
    
    @GetMapping
    public ResponseEntity<List<CompetitionResponse>> getCompetitions() {
        List<Competition> competitions = competitionRepository.findByStatusIn(
            List.of("upcoming", "active")
        );
        
        List<CompetitionResponse> responses = competitions.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CompetitionResponse> getCompetition(@PathVariable String id) {
        Competition competition = competitionRepository.findById(id)
            .orElseThrow(() -> new ApiException("대회를 찾을 수 없습니다.", HttpStatus.NOT_FOUND));
        return ResponseEntity.ok(toResponse(competition));
    }
    
    @GetMapping("/{id}/ranking")
    public ResponseEntity<List<Map<String, Object>>> getCompetitionRanking(@PathVariable String id) {
        List<CompetitionEntry> entries = competitionEntryRepository
            .findByCompetitionIdOrderByScoreDesc(id)
            .stream()
            .limit(10)
            .collect(Collectors.toList());
        
        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 0; i < entries.size(); i++) {
            CompetitionEntry entry = entries.get(i);
            Spiritling spiritling = spiritlingRepository.findById(entry.getSpiritlingId())
                .orElse(null);
            if (spiritling != null) {
                Map<String, Object> item = new HashMap<>();
                item.put("rank", i + 1);
                item.put("spiritling_id", spiritling.getId());
                item.put("spiritling_name", spiritling.getName());
                item.put("score", entry.getScore());
                result.add(item);
            }
        }
        
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/{id}/enter")
    public ResponseEntity<CompetitionEntry> enterCompetition(
        @PathVariable String id,
        @RequestBody Map<String, Object> request,
        Authentication authentication
    ) {
        String userId = authentication.getName();
        String spiritlingId = (String) request.get("spiritling_id");
        Double baseScore = request.get("score") != null ? 
            ((Number) request.get("score")).doubleValue() : 0.0;
        
        Competition competition = competitionRepository.findById(id)
            .orElseThrow(() -> new ApiException("대회를 찾을 수 없습니다.", HttpStatus.NOT_FOUND));
        
        if (!"active".equals(competition.getStatus())) {
            throw new ApiException("현재 참가 가능한 대회가 아닙니다.", HttpStatus.BAD_REQUEST);
        }
        
        Spiritling spiritling = spiritlingRepository.findById(spiritlingId)
            .orElseThrow(() -> new ApiException("마정령을 찾을 수 없습니다.", HttpStatus.NOT_FOUND));
        
        if (!spiritling.getUserId().equals(userId)) {
            throw new ApiException("마정령을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
        }
        
        Optional<CompetitionEntry> existing = competitionEntryRepository
            .findByCompetitionIdAndSpiritlingId(id, spiritlingId);
        if (existing.isPresent()) {
            throw new ApiException("이미 참가한 대회입니다.", HttpStatus.BAD_REQUEST);
        }
        
        Double score = calculateScore(spiritling, competition.getType(), baseScore);
        
        CompetitionEntry entry = new CompetitionEntry();
        entry.setId(UUID.randomUUID().toString());
        entry.setCompetitionId(id);
        entry.setSpiritlingId(spiritlingId);
        entry.setScore(score);
        
        CompetitionEntry saved = competitionEntryRepository.save(entry);
        updateRanking(id);
        
        return ResponseEntity.ok(saved);
    }
    
    private Double calculateScore(Spiritling spiritling, String competitionType, Double baseScore) {
        switch (competitionType) {
            case "race":
                return spiritling.getAgilityStat() * 0.7 + spiritling.getLuckStat() * 0.3 + baseScore;
            case "puzzle":
                return spiritling.getIntelligenceStat() * 0.8 + spiritling.getResilienceStat() * 0.2 + baseScore;
            case "battle":
                return spiritling.getHealthStat() * 0.4 + spiritling.getResilienceStat() * 0.3 + 
                       spiritling.getAgilityStat() * 0.3 + baseScore;
            case "fashion":
                return spiritling.getFriendlinessStat() * 0.6 + spiritling.getLuckStat() * 0.4 + baseScore;
            default:
                double totalStat = spiritling.getHealthStat() + spiritling.getAgilityStat() +
                    spiritling.getIntelligenceStat() + spiritling.getFriendlinessStat() +
                    spiritling.getResilienceStat() + spiritling.getLuckStat();
                return (totalStat / 6.0) + baseScore;
        }
    }
    
    private void updateRanking(String competitionId) {
        List<CompetitionEntry> entries = competitionEntryRepository
            .findByCompetitionIdOrderByScoreDesc(competitionId);
        for (int i = 0; i < entries.size(); i++) {
            entries.get(i).setRank(i + 1);
        }
        competitionEntryRepository.saveAll(entries);
    }
    
    private CompetitionResponse toResponse(Competition competition) {
        return new CompetitionResponse(
            competition.getId(),
            competition.getType(),
            competition.getName(),
            competition.getDescription(),
            competition.getStartDate(),
            competition.getEndDate(),
            competition.getRewards(),
            competition.getStatus()
        );
    }
}

