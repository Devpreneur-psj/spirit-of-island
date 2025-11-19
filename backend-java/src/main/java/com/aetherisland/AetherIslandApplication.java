package com.aetherisland;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class AetherIslandApplication {
    public static void main(String[] args) {
        System.out.println("🚀 Aether Island Backend 시작 중...");
        SpringApplication.run(AetherIslandApplication.class, args);
        System.out.println("✅ FastAPI 서버가 포트 8000에서 시작되었습니다!");
        System.out.println("📡 API 문서: http://localhost:8000/docs");
        System.out.println("🏥 Health check: http://localhost:8000/health");
    }
}

