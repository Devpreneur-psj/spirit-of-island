package com.aetherisland.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RankingListResponse {
    private String category;
    private String period;
    private List<RankingResponse> rankings;
    private Integer total;
}

