package com.aetherisland.service;

import com.aetherisland.entity.ActionLog;
import com.aetherisland.entity.Spiritling;
import com.aetherisland.repository.ActionLogRepository;
import com.aetherisland.repository.SpiritlingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class SpiritlingAIService {
    private final SpiritlingRepository spiritlingRepository;
    private final ActionLogRepository actionLogRepository;
    
    public SpiritlingAIService(SpiritlingRepository spiritlingRepository, ActionLogRepository actionLogRepository) {
        this.spiritlingRepository = spiritlingRepository;
        this.actionLogRepository = actionLogRepository;
    }
    
    @Transactional
    public void updateSpiritlingStatus(Spiritling spiritling) {
        Random random = new Random();
        
        // 배고픔 감소 (1-3씩)
        if (spiritling.getHunger() > 0) {
            spiritling.setHunger(Math.max(0, spiritling.getHunger() - random.nextInt(3) + 1));
        }
        
        // 행복도 감소 (배고픔이 낮으면 더 많이 감소)
        int happinessDecrease;
        if (spiritling.getHunger() < 30) {
            happinessDecrease = random.nextInt(3) + 2;
        } else {
            happinessDecrease = random.nextInt(2);
        }
        spiritling.setHappiness(Math.max(0, spiritling.getHappiness() - happinessDecrease));
        
        // 에너지 회복 (시간 경과에 따라)
        if (spiritling.getEnergy() < 100) {
            spiritling.setEnergy(Math.min(100, spiritling.getEnergy() + random.nextInt(2) + 1));
        }
        
        // 건강 상태 (청결도가 낮으면 건강도 감소)
        if (spiritling.getCleanliness() < 30) {
            spiritling.setHealthStatus(Math.max(0, spiritling.getHealthStatus() - random.nextInt(2)));
        }
        
        // 청결도 감소
        if (spiritling.getCleanliness() > 0) {
            spiritling.setCleanliness(Math.max(0, spiritling.getCleanliness() - random.nextInt(2)));
        }
    }
    
    @Transactional
    public List<String> autonomousAction(Spiritling spiritling) {
        List<String> actionMessages = new ArrayList<>();
        Random random = new Random();
        
        // 배고픔이 낮으면 자동으로 먹기 시도
        if (spiritling.getHunger() < 30 && random.nextDouble() < 0.3) {
            spiritling.setHunger(Math.min(100, spiritling.getHunger() + random.nextInt(11) + 10));
            spiritling.setExperience(spiritling.getExperience() + 1);
            String message = spiritling.getName() + "가 스스로 먹이를 찾아 먹었습니다.";
            createActionLog(spiritling.getId(), "auto_eat", message);
            actionMessages.add(message);
        }
        
        // 행복도가 낮으면 자동으로 놀기
        if (spiritling.getHappiness() < 40 && random.nextDouble() < 0.2) {
            spiritling.setHappiness(Math.min(100, spiritling.getHappiness() + random.nextInt(6) + 5));
            spiritling.setEnergy(Math.max(0, spiritling.getEnergy() - random.nextInt(6) + 5));
            spiritling.setExperience(spiritling.getExperience() + 1);
            String message = spiritling.getName() + "가 혼자서 놀고 있습니다.";
            createActionLog(spiritling.getId(), "auto_play", message);
            actionMessages.add(message);
        }
        
        // 에너지가 많으면 자동으로 활동
        if (spiritling.getEnergy() > 70 && random.nextDouble() < 0.1) {
            spiritling.setEnergy(Math.max(0, spiritling.getEnergy() - random.nextInt(6) + 10));
            spiritling.setExperience(spiritling.getExperience() + random.nextInt(2) + 1);
            List<String> activities = Arrays.asList(
                "달리기를 했습니다.",
                "점프를 했습니다.",
                "공을 굴렸습니다.",
                "구름을 바라보고 있습니다."
            );
            String activity = activities.get(random.nextInt(activities.size()));
            String message = spiritling.getName() + "가 " + activity;
            createActionLog(spiritling.getId(), "auto_activity", message);
            actionMessages.add(message);
        }
        
        // 레벨 업 체크
        if (checkLevelUp(spiritling)) {
            String message = spiritling.getName() + "가 레벨 " + spiritling.getLevel() + "로 성장했습니다!";
            createActionLog(spiritling.getId(), "level_up", message);
            actionMessages.add(message);
        }
        
        return actionMessages;
    }
    
    @Transactional
    public void processSpiritling(String spiritlingId) {
        Optional<Spiritling> optional = spiritlingRepository.findById(spiritlingId);
        if (optional.isEmpty()) {
            return;
        }
        
        Spiritling spiritling = optional.get();
        Random random = new Random();
        
        try {
            // 상태 업데이트 (50% 확률)
            if (random.nextDouble() < 0.5) {
                updateSpiritlingStatus(spiritling);
            }
            
            // 자율 행동 (30% 확률)
            if (random.nextDouble() < 0.3) {
                autonomousAction(spiritling);
            }
            
            spiritlingRepository.save(spiritling);
        } catch (Exception e) {
            System.err.println("Error processing spiritling " + spiritlingId + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private boolean checkLevelUp(Spiritling spiritling) {
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
            
            return true;
        }
        return false;
    }
    
    private void createActionLog(String spiritlingId, String actionType, String message) {
        ActionLog log = new ActionLog();
        log.setId(UUID.randomUUID().toString());
        log.setSpiritlingId(spiritlingId);
        log.setActionType(actionType);
        log.setMessage(message);
        actionLogRepository.save(log);
    }
}

