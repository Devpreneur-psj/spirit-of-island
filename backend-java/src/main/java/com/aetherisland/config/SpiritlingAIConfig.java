package com.aetherisland.config;

import com.aetherisland.repository.SpiritlingRepository;
import com.aetherisland.service.SpiritlingAIService;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class SpiritlingAIConfig {
    private final SpiritlingAIService aiService;
    private final SpiritlingRepository spiritlingRepository;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    
    public SpiritlingAIConfig(SpiritlingAIService aiService, SpiritlingRepository spiritlingRepository) {
        this.aiService = aiService;
        this.spiritlingRepository = spiritlingRepository;
    }
    
    @PostConstruct
    public void startBackgroundProcessor() {
        System.out.println("마정령 자율 행동 AI 백그라운드 프로세서를 시작합니다...");
        
        scheduler.scheduleWithFixedDelay(() -> {
            try {
                spiritlingRepository.findAll().forEach(spiritling -> {
                    aiService.processSpiritling(spiritling.getId());
                });
            } catch (Exception e) {
                System.err.println("Error in background processor: " + e.getMessage());
                e.printStackTrace();
            }
        }, 60, 300, TimeUnit.SECONDS); // 1분 후 시작, 5분마다 실행
        
        System.out.println("✅ 마정령 자율 행동 AI 백그라운드 프로세서 시작 완료");
    }
}

