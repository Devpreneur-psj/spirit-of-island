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

