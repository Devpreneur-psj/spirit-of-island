package com.aetherisland.dto;

import java.time.LocalDateTime;

public class UserResponse {
    private String id;
    private String username;
    private String email;
    private Integer coins;
    private LocalDateTime createdAt;
    
    public UserResponse() {}
    
    public UserResponse(String id, String username, String email, Integer coins, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.coins = coins;
        this.createdAt = createdAt;
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getCoins() { return coins; }
    public void setCoins(Integer coins) { this.coins = coins; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

