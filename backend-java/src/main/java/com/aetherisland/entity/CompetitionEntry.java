package com.aetherisland.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "competition_entries")
public class CompetitionEntry {
    @Id
    private String id;
    
    @Column(name = "competition_id", nullable = false)
    private String competitionId;
    
    @Column(name = "spiritling_id", nullable = false)
    private String spiritlingId;
    
    @Column(nullable = false)
    private Double score;
    
    @Column
    private Integer rank;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_id", insertable = false, updatable = false)
    private Competition competition;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "spiritling_id", insertable = false, updatable = false)
    private Spiritling spiritling;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCompetitionId() { return competitionId; }
    public void setCompetitionId(String competitionId) { this.competitionId = competitionId; }
    public String getSpiritlingId() { return spiritlingId; }
    public void setSpiritlingId(String spiritlingId) { this.spiritlingId = spiritlingId; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    public Integer getRank() { return rank; }
    public void setRank(Integer rank) { this.rank = rank; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Competition getCompetition() { return competition; }
    public void setCompetition(Competition competition) { this.competition = competition; }
    public Spiritling getSpiritling() { return spiritling; }
    public void setSpiritling(Spiritling spiritling) { this.spiritling = spiritling; }
}

