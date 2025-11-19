package com.aetherisland.dto;


import java.time.LocalDateTime;

public class CompetitionResponse {
    private String id;
    private String type;
    private String name;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String rewards;
    private String status;
    
    public CompetitionResponse() {}
    
    public CompetitionResponse(String id, String type, String name, String description, LocalDateTime startDate, LocalDateTime endDate, String rewards, String status) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.rewards = rewards;
        this.status = status;
    }
    
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
}

