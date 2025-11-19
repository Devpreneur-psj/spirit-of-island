package com.aetherisland.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
}

