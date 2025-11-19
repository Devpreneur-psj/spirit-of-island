package com.aetherisland.service;

import com.aetherisland.entity.Spiritling;
import com.aetherisland.entity.User;
import com.aetherisland.repository.SpiritlingRepository;
import com.aetherisland.repository.UserRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class SpiritlingSimulationService {
    
    private final SpiritlingRepository spiritlingRepository;
    private final UserRepository userRepository;
    
    public SpiritlingSimulationService(SpiritlingRepository spiritlingRepository, UserRepository userRepository) {
        this.spiritlingRepository = spiritlingRepository;
        this.userRepository = userRepository;
    }
    
    /**
     * 모든 유저의 정령들을 시뮬레이션
     * 5분마다 실행
     */
    @Scheduled(fixedRate = 300000) // 5분 = 300000ms
    @Async
    public void simulateAllSpiritlings() {
        List<Spiritling> allSpiritlings = spiritlingRepository.findAll();
        
        for (Spiritling spiritling : allSpiritlings) {
            try {
                simulateSpiritling(spiritling, 5); // 5분 경과
            } catch (Exception e) {
                System.err.println("Error simulating spiritling " + spiritling.getId() + ": " + e.getMessage());
            }
        }
        
        spiritlingRepository.saveAll(allSpiritlings);
        System.out.println("✅ 정령 시뮬레이션 완료: " + allSpiritlings.size() + "개 정령 처리");
    }
    
    /**
     * 특정 유저의 정령들을 시뮬레이션 (로그인 시 호출)
     * 마지막 업데이트 시간부터 현재까지 경과한 시간만큼 시뮬레이션
     */
    public void simulateUserSpiritlings(String userId) {
        List<Spiritling> userSpiritlings = spiritlingRepository.findByUserId(userId);
        LocalDateTime now = LocalDateTime.now();
        
        for (Spiritling spiritling : userSpiritlings) {
            LocalDateTime lastUpdated = spiritling.getUpdatedAt() != null 
                ? spiritling.getUpdatedAt() 
                : spiritling.getCreatedAt();
            
            long minutesPassed = Duration.between(lastUpdated, now).toMinutes();
            if (minutesPassed > 0) {
                simulateSpiritling(spiritling, (int) Math.min(minutesPassed, 1440)); // 최대 24시간
            }
        }
        
        spiritlingRepository.saveAll(userSpiritlings);
    }
    
    /**
     * 개별 정령 시뮬레이션
     * @param spiritling 시뮬레이션할 정령
     * @param minutes 경과한 시간 (분)
     */
    private void simulateSpiritling(Spiritling spiritling, int minutes) {
        if (minutes <= 0) return;
        
        // 기본 상태 감소 (시간 경과에 따라)
        int hungerDecrease = minutes / 10; // 10분당 배고픔 -1
        int energyDecrease = minutes / 15; // 15분당 에너지 -1
        int happinessDecrease = minutes / 20; // 20분당 행복도 -1
        int cleanlinessDecrease = minutes / 30; // 30분당 청결도 -1
        
        spiritling.setHunger(Math.max(0, spiritling.getHunger() - hungerDecrease));
        spiritling.setEnergy(Math.max(0, spiritling.getEnergy() - energyDecrease));
        spiritling.setHappiness(Math.max(0, spiritling.getHappiness() - happinessDecrease));
        spiritling.setCleanliness(Math.max(0, spiritling.getCleanliness() - cleanlinessDecrease));
        
        // 현재 작업에 따른 효과
        String currentAction = spiritling.getCurrentAction() != null ? spiritling.getCurrentAction() : "idle";
        
        switch (currentAction) {
            case "training":
                // 훈련: 경험치 증가, 피로도 증가, 능력치 약간 증가
                spiritling.setExperience(spiritling.getExperience() + minutes * 2);
                spiritling.setEnergy(Math.max(0, spiritling.getEnergy() - minutes / 2));
                spiritling.setHunger(Math.max(0, spiritling.getHunger() - minutes / 8));
                break;
                
            case "resting":
                // 휴식: 에너지 회복, 체력 회복, 피로도 감소
                spiritling.setEnergy(Math.min(100, spiritling.getEnergy() + minutes / 3));
                spiritling.setHealthStatus(Math.min(100, spiritling.getHealthStatus() + minutes / 5));
                spiritling.setHunger(Math.max(0, spiritling.getHunger() - minutes / 15));
                break;
                
            case "farming":
                // 농장일: 경험치 증가, 피로도 증가, 골드 획득
                spiritling.setExperience(spiritling.getExperience() + minutes);
                spiritling.setEnergy(Math.max(0, spiritling.getEnergy() - minutes / 3));
                spiritling.setHunger(Math.max(0, spiritling.getHunger() - minutes / 5));
                
                // 골드 획득 (5분당 1골드)
                User user = userRepository.findById(spiritling.getUserId()).orElse(null);
                if (user != null) {
                    int goldEarned = minutes / 5; // 5분당 1골드
                    user.setCoins(user.getCoins() + goldEarned);
                    userRepository.save(user);
                }
                break;
                
            case "exploring":
                // 탐험: 경험치 증가, 에너지 소모
                spiritling.setExperience(spiritling.getExperience() + minutes * 3);
                spiritling.setEnergy(Math.max(0, spiritling.getEnergy() - minutes / 2));
                spiritling.setHunger(Math.max(0, spiritling.getHunger() - minutes / 8));
                break;
                
            case "playing":
                // 놀기: 행복도 증가, 에너지 소모
                spiritling.setHappiness(Math.min(100, spiritling.getHappiness() + minutes / 5));
                spiritling.setEnergy(Math.max(0, spiritling.getEnergy() - minutes / 4));
                spiritling.setExperience(spiritling.getExperience() + minutes);
                break;
                
            case "idle":
            default:
                // 자유 행동: 자연스러운 상태 변화
                if (spiritling.getHunger() < 50 && spiritling.getEnergy() > 50) {
                    // 배고프면 자동으로 음식 찾기 (배고픔 회복)
                    spiritling.setHunger(Math.min(100, spiritling.getHunger() + minutes / 10));
                }
                if (spiritling.getEnergy() < 30) {
                    // 피곤하면 자동으로 쉬기 (에너지 회복)
                    spiritling.setEnergy(Math.min(100, spiritling.getEnergy() + minutes / 5));
                }
                break;
        }
        
        // 성격에 따른 추가 효과
        applyPersonalityEffects(spiritling, minutes, currentAction);
        
        // 레벨업 체크
        checkLevelUp(spiritling);
        
        // 업데이트 시간 갱신
        spiritling.setUpdatedAt(LocalDateTime.now());
    }
    
    /**
     * 성격에 따른 추가 효과
     */
    private void applyPersonalityEffects(Spiritling spiritling, int minutes, String action) {
        String personality = spiritling.getPersonality() != null ? spiritling.getPersonality() : "normal";
        
        switch (personality) {
            case "hard_worker":
                // 근면한: 훈련/농장일 시 경험치 +20%, 피로도 +30%
                if ("training".equals(action) || "farming".equals(action)) {
                    spiritling.setExperience(spiritling.getExperience() + minutes / 5);
                    spiritling.setEnergy(Math.max(0, spiritling.getEnergy() - minutes / 3));
                }
                break;
                
            case "lazy":
                // 게으른: 휴식 시 더 빠른 회복, 훈련 시 느린 경험치 획득
                if ("resting".equals(action)) {
                    spiritling.setEnergy(Math.min(100, spiritling.getEnergy() + minutes / 2));
                } else if ("training".equals(action)) {
                    spiritling.setExperience(spiritling.getExperience() + minutes / 3);
                }
                break;
                
            case "glutton":
                // 탐욕: 배고픔 빨리 감소, 음식 먹으면 행복도 많이 증가
                spiritling.setHunger(Math.max(0, spiritling.getHunger() - minutes / 7));
                if (spiritling.getHunger() > 70) {
                    spiritling.setHappiness(Math.min(100, spiritling.getHappiness() + minutes / 15));
                }
                break;
                
            case "loner":
                // 외톨이: 다른 정령 근처에서 행복도 감소 (현재는 단순 처리)
                if (!"idle".equals(action)) {
                    spiritling.setHappiness(Math.max(0, spiritling.getHappiness() - minutes / 30));
                }
                break;
                
            case "playful":
                // 장난꾸러기: 놀기 시 행복도 +50%, 다른 활동 시 행복도 감소
                if ("playing".equals(action)) {
                    spiritling.setHappiness(Math.min(100, spiritling.getHappiness() + minutes / 3));
                } else if (!"idle".equals(action)) {
                    spiritling.setHappiness(Math.max(0, spiritling.getHappiness() - minutes / 40));
                }
                break;
        }
    }
    
    /**
     * 레벨업 체크 및 처리
     */
    private void checkLevelUp(Spiritling spiritling) {
        int requiredExp = spiritling.getLevel() * 100;
        
        while (spiritling.getExperience() >= requiredExp) {
            spiritling.setExperience(spiritling.getExperience() - requiredExp);
            spiritling.setLevel(spiritling.getLevel() + 1);
            
            // 레벨업 시 모든 스탯 증가
            spiritling.setHealthStat(Math.min(100, spiritling.getHealthStat() + 1));
            spiritling.setAgilityStat(Math.min(100, spiritling.getAgilityStat() + 1));
            spiritling.setIntelligenceStat(Math.min(100, spiritling.getIntelligenceStat() + 1));
            spiritling.setFriendlinessStat(Math.min(100, spiritling.getFriendlinessStat() + 1));
            spiritling.setResilienceStat(Math.min(100, spiritling.getResilienceStat() + 1));
            spiritling.setLuckStat(Math.min(100, spiritling.getLuckStat() + 1));
            
            // 성장 단계 업데이트
            updateGrowthStage(spiritling);
            
            requiredExp = spiritling.getLevel() * 100; // 다음 레벨 필요 경험치
        }
    }
    
    /**
     * 성장 단계 업데이트
     */
    private void updateGrowthStage(Spiritling spiritling) {
        int level = spiritling.getLevel();
        
        if (level >= 50) {
            spiritling.setGrowthStage("elder");
        } else if (level >= 40) {
            spiritling.setGrowthStage("transcendent");
        } else if (level >= 25) {
            spiritling.setGrowthStage("adult");
        } else if (level >= 15) {
            spiritling.setGrowthStage("adolescent");
        } else if (level >= 5) {
            spiritling.setGrowthStage("infant");
        } else {
            spiritling.setGrowthStage("egg");
        }
    }
}

