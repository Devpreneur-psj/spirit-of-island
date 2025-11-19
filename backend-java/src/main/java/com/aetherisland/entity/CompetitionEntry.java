package com.aetherisland.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "competition_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}

