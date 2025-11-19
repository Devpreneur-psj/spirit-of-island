package com.aetherisland.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        System.out.println("🏥 Health check 요청 받음");
        Map<String, Object> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("database", "connected");
        System.out.println("✅ Health check 성공");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/")
    public ResponseEntity<Map<String, String>> root() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Aether Island API");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }
}

