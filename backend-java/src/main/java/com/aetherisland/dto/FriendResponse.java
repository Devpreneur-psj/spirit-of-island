package com.aetherisland.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendResponse {
    private String id;
    private String userId;
    private String friendId;
    private String username;
    private String email;
    private String status;
    private LocalDateTime createdAt;
}

