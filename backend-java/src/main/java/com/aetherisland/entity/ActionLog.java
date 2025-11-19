package com.aetherisland.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "action_logs")
public class ActionLog {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;
    
    @Column(name = "spiritling_id", nullable = false)
    private String spiritlingId;
    
    @Column(name = "action_type", nullable = false)
    private String actionType;
    
    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;
    
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
    public String getSpiritlingId() { return spiritlingId; }
    public void setSpiritlingId(String spiritlingId) { this.spiritlingId = spiritlingId; }
    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Spiritling getSpiritling() { return spiritling; }
    public void setSpiritling(Spiritling spiritling) { this.spiritling = spiritling; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

