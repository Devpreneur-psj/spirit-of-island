package com.aetherisland.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "competitions")
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
    
    // 명시적 getter/setter (Lombok 백업용)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }
    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }
    public String getRewards() { return rewards; }
    public void setRewards(String rewards) { this.rewards = rewards; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<CompetitionEntry> getEntries() { return entries; }
    public void setEntries(List<CompetitionEntry> entries) { this.entries = entries; }
}

