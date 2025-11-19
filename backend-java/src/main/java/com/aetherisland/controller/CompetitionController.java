package com.aetherisland.controller;

import com.aetherisland.dto.CompetitionResponse;
import com.aetherisland.entity.Competition;
import com.aetherisland.repository.CompetitionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/competitions")
public class CompetitionController {
    private final CompetitionRepository competitionRepository;
    
    public CompetitionController(CompetitionRepository competitionRepository) {
        this.competitionRepository = competitionRepository;
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

