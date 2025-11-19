package com.aetherisland.service;

import com.aetherisland.dto.SpiritlingCreateRequest;
import com.aetherisland.dto.SpiritlingResponse;
import com.aetherisland.entity.ActionLog;
import com.aetherisland.entity.Spiritling;
import com.aetherisland.repository.ActionLogRepository;
import com.aetherisland.repository.SpiritlingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SpiritlingService {
    private final SpiritlingRepository spiritlingRepository;
    private final ActionLogRepository actionLogRepository;
    
    public SpiritlingService(SpiritlingRepository spiritlingRepository, ActionLogRepository actionLogRepository) {
        this.spiritlingRepository = spiritlingRepository;
        this.actionLogRepository = actionLogRepository;
    }
    
    @Transactional
    public SpiritlingResponse createSpiritling(SpiritlingCreateRequest request, String userId) {
        Spiritling spiritling = new Spiritling();
        spiritling.setId(UUID.randomUUID().toString());
        spiritling.setName(request.getName());
        spiritling.setElement(request.getElement());
        spiritling.setPersonality(request.getPersonality());
        spiritling.setGrowthStage("egg");
        spiritling.setLevel(1);
        spiritling.setExperience(0);
        spiritling.setHealthStat(10);
        spiritling.setAgilityStat(10);
        spiritling.setIntelligenceStat(10);
        spiritling.setFriendlinessStat(10);
        spiritling.setResilienceStat(10);
        spiritling.setLuckStat(10);
        spiritling.setHunger(100);
        spiritling.setHappiness(100);
        spiritling.setEnergy(100);
        spiritling.setHealthStatus(100);
        spiritling.setCleanliness(100);
        spiritling.setCurrentAction("idle");
        spiritling.setUserId(userId);
        
        Spiritling saved = spiritlingRepository.save(spiritling);
        
        // 생성 로그
        ActionLog log = new ActionLog();
        log.setId(UUID.randomUUID().toString());
        log.setSpiritlingId(saved.getId());
        log.setActionType("create");
        log.setAction("create"); // action 필드도 설정
        log.setMessage(saved.getName() + "이(가) 태어났습니다! 🎉");
        actionLogRepository.save(log);
        
        return toResponse(saved);
    }
    
    public List<SpiritlingResponse> getSpiritlingsByUserId(String userId) {
        return spiritlingRepository.findByUserId(userId).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
    
    public SpiritlingResponse getSpiritlingById(String id, String userId) {
        Spiritling spiritling = spiritlingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("마정령을 찾을 수 없습니다."));
        
        if (!spiritling.getUserId().equals(userId)) {
            throw new RuntimeException("마정령을 찾을 수 없습니다.");
        }
        
        return toResponse(spiritling);
    }
    
    @Transactional
    public SpiritlingResponse feedSpiritling(String id, String userId) {
        Spiritling spiritling = getSpiritlingByIdAndUser(id, userId);
        
        spiritling.setHunger(Math.min(100, spiritling.getHunger() + 20));
        spiritling.setHappiness(Math.min(100, spiritling.getHappiness() + 5));
        spiritling.setExperience(spiritling.getExperience() + 2);
        
        checkAndLevelUp(spiritling);
        createActionLog(spiritling.getId(), "feed", 
            spiritling.getName() + "에게 먹이를 주었습니다. 배고픔 +20, 행복도 +5");
        
        spiritlingRepository.save(spiritling);
        return toResponse(spiritling);
    }
    
    @Transactional
    public SpiritlingResponse playWithSpiritling(String id, String userId) {
        Spiritling spiritling = getSpiritlingByIdAndUser(id, userId);
        
        spiritling.setHappiness(Math.min(100, spiritling.getHappiness() + 15));
        spiritling.setFriendlinessStat(Math.min(100, spiritling.getFriendlinessStat() + 1));
        spiritling.setEnergy(Math.max(0, spiritling.getEnergy() - 10));
        spiritling.setExperience(spiritling.getExperience() + 3);
        
        checkAndLevelUp(spiritling);
        createActionLog(spiritling.getId(), "play", 
            spiritling.getName() + "와 놀았습니다. 행복도 +15, 친근함 +1, 에너지 -10");
        
        spiritlingRepository.save(spiritling);
        return toResponse(spiritling);
    }
    
    @Transactional
    public SpiritlingResponse healSpiritling(String id, String userId) {
        Spiritling spiritling = getSpiritlingByIdAndUser(id, userId);
        
        spiritling.setHealthStatus(Math.min(100, spiritling.getHealthStatus() + 25));
        spiritling.setHealthStat(Math.min(100, spiritling.getHealthStat() + 2));
        spiritling.setHappiness(Math.min(100, spiritling.getHappiness() + 5));
        spiritling.setExperience(spiritling.getExperience() + 2);
        
        checkAndLevelUp(spiritling);
        createActionLog(spiritling.getId(), "heal", 
            spiritling.getName() + "를 치료했습니다. 건강 +25, 체력 +2, 행복도 +5");
        
        spiritlingRepository.save(spiritling);
        return toResponse(spiritling);
    }
    
    @Transactional
    public SpiritlingResponse cleanSpiritling(String id, String userId) {
        Spiritling spiritling = getSpiritlingByIdAndUser(id, userId);
        
        spiritling.setCleanliness(Math.min(100, spiritling.getCleanliness() + 30));
        spiritling.setHappiness(Math.min(100, spiritling.getHappiness() + 10));
        spiritling.setHealthStatus(Math.min(100, spiritling.getHealthStatus() + 5));
        spiritling.setExperience(spiritling.getExperience() + 2);
        
        checkAndLevelUp(spiritling);
        createActionLog(spiritling.getId(), "clean", 
            spiritling.getName() + "를 씻겼습니다. 청결도 +30, 행복도 +10, 건강 +5");
        
        spiritlingRepository.save(spiritling);
        return toResponse(spiritling);
    }
    
    @Transactional
    public SpiritlingResponse trainSpiritling(String id, String userId, String statType) {
        Spiritling spiritling = getSpiritlingByIdAndUser(id, userId);
        
        if (spiritling.getEnergy() < 20) {
            throw new RuntimeException("에너지가 부족합니다. (필요: 20, 현재: " + spiritling.getEnergy() + ")");
        }
        
        spiritling.setEnergy(spiritling.getEnergy() - 20);
        spiritling.setExperience(spiritling.getExperience() + 5);
        
        switch (statType) {
            case "health":
                spiritling.setHealthStat(Math.min(100, spiritling.getHealthStat() + 2));
                break;
            case "agility":
                spiritling.setAgilityStat(Math.min(100, spiritling.getAgilityStat() + 2));
                break;
            case "intelligence":
                spiritling.setIntelligenceStat(Math.min(100, spiritling.getIntelligenceStat() + 2));
                break;
            case "friendliness":
                spiritling.setFriendlinessStat(Math.min(100, spiritling.getFriendlinessStat() + 2));
                break;
            case "resilience":
                spiritling.setResilienceStat(Math.min(100, spiritling.getResilienceStat() + 2));
                break;
            case "luck":
                spiritling.setLuckStat(Math.min(100, spiritling.getLuckStat() + 2));
                break;
            default:
                throw new RuntimeException("잘못된 스탯 타입입니다: " + statType);
        }
        
        checkAndLevelUp(spiritling);
        createActionLog(spiritling.getId(), "train", 
            spiritling.getName() + "의 " + statType + " 스탯을 훈련했습니다. +2, 에너지 -20");
        
        spiritlingRepository.save(spiritling);
        return toResponse(spiritling);
    }

    @Transactional
    public SpiritlingResponse assignTask(String id, String userId, String task) {
        Spiritling spiritling = getSpiritlingByIdAndUser(id, userId);
        
        // 유효한 작업인지 확인
        List<String> validTasks = List.of("idle", "training", "resting", "farming", "exploring", "playing");
        if (!validTasks.contains(task)) {
            throw new RuntimeException("유효하지 않은 작업입니다: " + task);
        }
        
        spiritling.setCurrentAction(task);
        spiritlingRepository.save(spiritling);
        
        String taskName = switch (task) {
            case "idle" -> "자유 행동";
            case "training" -> "훈련";
            case "resting" -> "휴식";
            case "farming" -> "농장일";
            case "exploring" -> "탐험";
            case "playing" -> "놀기";
            default -> task;
        };
        
        createActionLog(spiritling.getId(), "assign_task", 
            spiritling.getName() + "에게 '" + taskName + "' 작업을 지정했습니다.");
        
        return toResponse(spiritling);
    }
    
    private Spiritling getSpiritlingByIdAndUser(String id, String userId) {
        Spiritling spiritling = spiritlingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("마정령을 찾을 수 없습니다."));
        
        if (!spiritling.getUserId().equals(userId)) {
            throw new RuntimeException("마정령을 찾을 수 없습니다.");
        }
        
        return spiritling;
    }
    
    private void checkAndLevelUp(Spiritling spiritling) {
        int requiredExp = spiritling.getLevel() * 100;
        if (spiritling.getExperience() >= requiredExp) {
            spiritling.setLevel(spiritling.getLevel() + 1);
            spiritling.setExperience(0);
            
            // 레벨업 시 모든 스탯 증가
            spiritling.setHealthStat(Math.min(100, spiritling.getHealthStat() + 1));
            spiritling.setAgilityStat(Math.min(100, spiritling.getAgilityStat() + 1));
            spiritling.setIntelligenceStat(Math.min(100, spiritling.getIntelligenceStat() + 1));
            spiritling.setFriendlinessStat(Math.min(100, spiritling.getFriendlinessStat() + 1));
            spiritling.setResilienceStat(Math.min(100, spiritling.getResilienceStat() + 1));
            spiritling.setLuckStat(Math.min(100, spiritling.getLuckStat() + 1));
            
            // 성장 단계 업데이트
            if (spiritling.getLevel() >= 50) {
                spiritling.setGrowthStage("elder");
            } else if (spiritling.getLevel() >= 40) {
                spiritling.setGrowthStage("transcendent");
            } else if (spiritling.getLevel() >= 25) {
                spiritling.setGrowthStage("adult");
            } else if (spiritling.getLevel() >= 15) {
                spiritling.setGrowthStage("adolescent");
            } else if (spiritling.getLevel() >= 5) {
                spiritling.setGrowthStage("infant");
            }
            
            createActionLog(spiritling.getId(), "level_up", 
                spiritling.getName() + "가 레벨 " + spiritling.getLevel() + "로 성장했습니다!");
        }
    }
    
    private void createActionLog(String spiritlingId, String actionType, String message) {
        ActionLog log = new ActionLog();
        log.setId(UUID.randomUUID().toString());
        log.setSpiritlingId(spiritlingId);
        log.setActionType(actionType);
        log.setAction(actionType);
        log.setMessage(message);
        actionLogRepository.save(log);
    }
    
    private SpiritlingResponse toResponse(Spiritling spiritling) {
        return new SpiritlingResponse(
            spiritling.getId(),
            spiritling.getName(),
            spiritling.getElement(),
            spiritling.getPersonality(),
            spiritling.getGrowthStage(),
            spiritling.getLevel(),
            spiritling.getExperience(),
            spiritling.getHealthStat(),
            spiritling.getAgilityStat(),
            spiritling.getIntelligenceStat(),
            spiritling.getFriendlinessStat(),
            spiritling.getResilienceStat(),
            spiritling.getLuckStat(),
            spiritling.getHunger(),
            spiritling.getHappiness(),
            spiritling.getEnergy(),
            spiritling.getHealthStatus(),
            spiritling.getCleanliness(),
            spiritling.getCurrentAction(),
            spiritling.getActionData(),
            spiritling.getUserId(),
            spiritling.getCreatedAt(),
            spiritling.getUpdatedAt()
        );
    }
}

