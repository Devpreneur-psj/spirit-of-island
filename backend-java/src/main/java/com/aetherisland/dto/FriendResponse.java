package com.aetherisland.dto;


import java.time.LocalDateTime;

public class FriendResponse {
    private String id;
    private String userId;
    private String friendId;
    private String username;
    private String email;
    private String status;
    private LocalDateTime createdAt;
    
    public FriendResponse() {}
    
    public FriendResponse(String id, String userId, String friendId, String username, String email, String status, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.friendId = friendId;
        this.username = username;
        this.email = email;
        this.status = status;
        this.createdAt = createdAt;
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getFriendId() { return friendId; }
    public void setFriendId(String friendId) { this.friendId = friendId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

