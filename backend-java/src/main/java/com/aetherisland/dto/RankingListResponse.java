package com.aetherisland.dto;


import java.util.List;

public class RankingListResponse {
    private String category;
    private String period;
    private List<RankingResponse> rankings;
    private Integer total;
    
    public RankingListResponse() {}
    
    public RankingListResponse(String category, String period, List<RankingResponse> rankings, Integer total) {
        this.category = category;
        this.period = period;
        this.rankings = rankings;
        this.total = total;
    }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
    public List<RankingResponse> getRankings() { return rankings; }
    public void setRankings(List<RankingResponse> rankings) { this.rankings = rankings; }
    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }
}

