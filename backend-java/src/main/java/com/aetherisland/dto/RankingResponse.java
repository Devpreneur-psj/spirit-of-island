package com.aetherisland.dto;


import java.time.LocalDateTime;

public class RankingResponse {
    private String id;
    private String userId;
    private String category;
    private Integer rank;
    private Double score;
    private String period;
    private LocalDateTime periodStart;
    private LocalDateTime periodEnd;
    private UserInfo user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public RankingResponse() {}
    
    public RankingResponse(String id, String userId, String category, Integer rank, Double score, String period, LocalDateTime periodStart, LocalDateTime periodEnd, UserInfo user, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.category = category;
        this.rank = rank;
        this.score = score;
        this.period = period;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
        this.user = user;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Integer getRank() { return rank; }
    public void setRank(Integer rank) { this.rank = rank; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
    public LocalDateTime getPeriodStart() { return periodStart; }
    public void setPeriodStart(LocalDateTime periodStart) { this.periodStart = periodStart; }
    public LocalDateTime getPeriodEnd() { return periodEnd; }
    public void setPeriodEnd(LocalDateTime periodEnd) { this.periodEnd = periodEnd; }
    public UserInfo getUser() { return user; }
    public void setUser(UserInfo user) { this.user = user; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public static class UserInfo {
        private String id;
        private String username;
        
        public UserInfo() {}
        
        public UserInfo(String id, String username) {
            this.id = id;
            this.username = username;
        }
        
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
    }
}

