package com.aetherisland.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "spiritlings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Spiritling {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String element;
    
    @Column(nullable = false)
    private String personality;
    
    @Column(name = "growth_stage")
    private String growthStage = "egg";
    
    @Column(nullable = false)
    private Integer level = 1;
    
    @Column(nullable = false)
    private Integer experience = 0;
    
    // 스탯
    @Column(name = "health_stat")
    private Integer healthStat = 10;
    
    @Column(name = "agility_stat")
    private Integer agilityStat = 10;
    
    @Column(name = "intelligence_stat")
    private Integer intelligenceStat = 10;
    
    @Column(name = "friendliness_stat")
    private Integer friendlinessStat = 10;
    
    @Column(name = "resilience_stat")
    private Integer resilienceStat = 10;
    
    @Column(name = "luck_stat")
    private Integer luckStat = 10;
    
    // 상태
    @Column(nullable = false)
    private Integer hunger = 100;
    
    @Column(nullable = false)
    private Integer happiness = 100;
    
    @Column(nullable = false)
    private Integer energy = 100;
    
    @Column(name = "health_status")
    private Integer healthStatus = 100;
    
    @Column(nullable = false)
    private Integer cleanliness = 100;
    
    // 자율 행동 AI 상태
    @Column(name = "current_action")
    private String currentAction = "idle";
    
    @Column(name = "action_data", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> actionData;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User owner;
    
    @OneToMany(mappedBy = "spiritling", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ActionLog> actionLogs;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

