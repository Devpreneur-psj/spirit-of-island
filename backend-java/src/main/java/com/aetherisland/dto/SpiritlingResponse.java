package com.aetherisland.dto;


import java.time.LocalDateTime;
import java.util.Map;

public class SpiritlingResponse {
    private String id;
    private String name;
    private String element;
    private String personality;
    private String growthStage;
    private Integer level;
    private Integer experience;
    private Integer healthStat;
    private Integer agilityStat;
    private Integer intelligenceStat;
    private Integer friendlinessStat;
    private Integer resilienceStat;
    private Integer luckStat;
    private Integer hunger;
    private Integer happiness;
    private Integer energy;
    private Integer healthStatus;
    private Integer cleanliness;
    private String currentAction;
    private Map<String, Object> actionData;
    private String userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public SpiritlingResponse() {}
    
    public SpiritlingResponse(String id, String name, String element, String personality, String growthStage, Integer level, Integer experience, Integer healthStat, Integer agilityStat, Integer intelligenceStat, Integer friendlinessStat, Integer resilienceStat, Integer luckStat, Integer hunger, Integer happiness, Integer energy, Integer healthStatus, Integer cleanliness, String currentAction, Map<String, Object> actionData, String userId, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.element = element;
        this.personality = personality;
        this.growthStage = growthStage;
        this.level = level;
        this.experience = experience;
        this.healthStat = healthStat;
        this.agilityStat = agilityStat;
        this.intelligenceStat = intelligenceStat;
        this.friendlinessStat = friendlinessStat;
        this.resilienceStat = resilienceStat;
        this.luckStat = luckStat;
        this.hunger = hunger;
        this.happiness = happiness;
        this.energy = energy;
        this.healthStatus = healthStatus;
        this.cleanliness = cleanliness;
        this.currentAction = currentAction;
        this.actionData = actionData;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

