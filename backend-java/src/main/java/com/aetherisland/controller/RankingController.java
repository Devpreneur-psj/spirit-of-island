package com.aetherisland.controller;

import com.aetherisland.dto.RankingListResponse;
import com.aetherisland.dto.RankingResponse;
import com.aetherisland.entity.Spiritling;
import com.aetherisland.entity.User;
import com.aetherisland.repository.SpiritlingRepository;
import com.aetherisland.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/rankings")
public class RankingController {
    private final UserRepository userRepository;
    private final SpiritlingRepository spiritlingRepository;
    
    public RankingController(UserRepository userRepository, SpiritlingRepository spiritlingRepository) {
        this.userRepository = userRepository;
        this.spiritlingRepository = spiritlingRepository;
    }
    
    @GetMapping("/{category}")
    public ResponseEntity<RankingListResponse> getRankings(
        @PathVariable String category,
        @RequestParam(defaultValue = "all_time") String period,
        @RequestParam(defaultValue = "100") int limit,
        Authentication authentication
    ) {
        List<RankingItem> rankings = calculateRankings(category);
        
        List<RankingResponse> responses = new ArrayList<>();
        for (int i = 0; i < Math.min(rankings.size(), limit); i++) {
            RankingItem item = rankings.get(i);
            RankingResponse response = new RankingResponse(
                UUID.randomUUID().toString(),
                item.getUserId(),
                category,
                i + 1,
                item.getScore(),
                period,
                null,
                null,
                new RankingResponse.UserInfo(item.getUserId(), item.getUsername()),
                LocalDateTime.now(),
                LocalDateTime.now()
            );
            responses.add(response);
        }
        
        RankingListResponse result = new RankingListResponse(
            category,
            period,
            responses,
            responses.size()
        );
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/user/me")
    public ResponseEntity<RankingResponse> getMyRanking(
        @RequestParam(defaultValue = "overall") String category,
        @RequestParam(defaultValue = "all_time") String period,
        Authentication authentication
    ) {
        String userId = authentication.getName();
        List<RankingItem> rankings = calculateRankings(category);
        
        int myRank = 0;
        double myScore = 0.0;
        String username = "";
        
        for (int i = 0; i < rankings.size(); i++) {
            if (rankings.get(i).getUserId().equals(userId)) {
                myRank = i + 1;
                myScore = rankings.get(i).getScore();
                username = rankings.get(i).getUsername();
                break;
            }
        }
        
        if (myRank == 0) {
            // 랭킹에 없으면 점수 계산
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                username = user.getUsername();
                myScore = calculateUserScore(userId, category);
                myRank = rankings.size() + 1;
            }
        }
        
        RankingResponse response = new RankingResponse(
            UUID.randomUUID().toString(),
            userId,
            category,
            myRank,
            myScore,
            period,
            null,
            null,
            new RankingResponse.UserInfo(userId, username),
            LocalDateTime.now(),
            LocalDateTime.now()
        );
        
        return ResponseEntity.ok(response);
    }
    
    private List<RankingItem> calculateRankings(String category) {
        List<User> users = userRepository.findAll();
        List<RankingItem> rankings = new ArrayList<>();
        
        for (User user : users) {
            double score = calculateUserScore(user.getId(), category);
            rankings.add(new RankingItem(user.getId(), user.getUsername(), score));
        }
        
        rankings.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        return rankings;
    }
    
    private double calculateUserScore(String userId, String category) {
        List<Spiritling> spiritlings = spiritlingRepository.findByUserId(userId);
        User user = userRepository.findById(userId).orElse(null);
        
        if (user == null) return 0.0;
        
        switch (category) {
            case "overall":
                int totalLevel = spiritlings.stream().mapToInt(s -> s.getLevel() != null ? s.getLevel() : 0).sum();
                int totalStats = spiritlings.stream().mapToInt(s ->
                    (s.getHealthStat() != null ? s.getHealthStat() : 0) +
                    (s.getAgilityStat() != null ? s.getAgilityStat() : 0) +
                    (s.getIntelligenceStat() != null ? s.getIntelligenceStat() : 0) +
                    (s.getFriendlinessStat() != null ? s.getFriendlinessStat() : 0) +
                    (s.getResilienceStat() != null ? s.getResilienceStat() : 0) +
                    (s.getLuckStat() != null ? s.getLuckStat() : 0)
                ).sum();
                return totalLevel * 10.0 + totalStats + (user.getCoins() != null ? user.getCoins() : 0);
            case "level":
                return spiritlings.stream().mapToInt(s -> s.getLevel() != null ? s.getLevel() : 0).max().orElse(0);
            case "coins":
                return user.getCoins() != null ? user.getCoins() : 0;
            case "spiritlings":
                return spiritlings.size();
            default:
                return 0.0;
        }
    }
    
    private static class RankingItem {
        private String userId;
        private String username;
        private double score;
        
        public RankingItem(String userId, String username, double score) {
            this.userId = userId;
            this.username = username;
            this.score = score;
        }
        
        public String getUserId() { return userId; }
        public String getUsername() { return username; }
        public double getScore() { return score; }
    }
}

