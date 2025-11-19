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
    
    // 명시적 getter/setter (Lombok 백업용)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getElement() { return element; }
    public void setElement(String element) { this.element = element; }
    public String getPersonality() { return personality; }
    public void setPersonality(String personality) { this.personality = personality; }
    public String getGrowthStage() { return growthStage; }
    public void setGrowthStage(String growthStage) { this.growthStage = growthStage; }
    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }
    public Integer getExperience() { return experience; }
    public void setExperience(Integer experience) { this.experience = experience; }
    public Integer getHealthStat() { return healthStat; }
    public void setHealthStat(Integer healthStat) { this.healthStat = healthStat; }
    public Integer getAgilityStat() { return agilityStat; }
    public void setAgilityStat(Integer agilityStat) { this.agilityStat = agilityStat; }
    public Integer getIntelligenceStat() { return intelligenceStat; }
    public void setIntelligenceStat(Integer intelligenceStat) { this.intelligenceStat = intelligenceStat; }
    public Integer getFriendlinessStat() { return friendlinessStat; }
    public void setFriendlinessStat(Integer friendlinessStat) { this.friendlinessStat = friendlinessStat; }
    public Integer getResilienceStat() { return resilienceStat; }
    public void setResilienceStat(Integer resilienceStat) { this.resilienceStat = resilienceStat; }
    public Integer getLuckStat() { return luckStat; }
    public void setLuckStat(Integer luckStat) { this.luckStat = luckStat; }
    public Integer getHunger() { return hunger; }
    public void setHunger(Integer hunger) { this.hunger = hunger; }
    public Integer getHappiness() { return happiness; }
    public void setHappiness(Integer happiness) { this.happiness = happiness; }
    public Integer getEnergy() { return energy; }
    public void setEnergy(Integer energy) { this.energy = energy; }
    public Integer getHealthStatus() { return healthStatus; }
    public void setHealthStatus(Integer healthStatus) { this.healthStatus = healthStatus; }
    public Integer getCleanliness() { return cleanliness; }
    public void setCleanliness(Integer cleanliness) { this.cleanliness = cleanliness; }
    public String getCurrentAction() { return currentAction; }
    public void setCurrentAction(String currentAction) { this.currentAction = currentAction; }
    public Map<String, Object> getActionData() { return actionData; }
    public void setActionData(Map<String, Object> actionData) { this.actionData = actionData; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
    public List<ActionLog> getActionLogs() { return actionLogs; }
    public void setActionLogs(List<ActionLog> actionLogs) { this.actionLogs = actionLogs; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

