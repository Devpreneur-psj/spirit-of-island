package com.aetherisland.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private String id;
        private String username;
    }
}

