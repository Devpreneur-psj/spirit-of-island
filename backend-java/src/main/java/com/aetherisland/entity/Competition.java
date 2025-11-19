package com.aetherisland.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "competitions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Competition {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String type; // race, puzzle, battle, fashion
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "start_date")
    private LocalDateTime startDate;
    
    @Column(name = "end_date")
    private LocalDateTime endDate;
    
    @Column(columnDefinition = "JSON")
    private String rewards; // JSON string: {first: [...], second: [...], third: [...]}
    
    @Column(nullable = false)
    private String status = "upcoming"; // upcoming, active, ended
    
    @OneToMany(mappedBy = "competition", cascade = CascadeType.ALL)
    private List<CompetitionEntry> entries;
}

