package com.aetherisland.controller;

import com.aetherisland.dto.SpiritlingCreateRequest;
import com.aetherisland.dto.SpiritlingResponse;
import com.aetherisland.service.SpiritlingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/spiritlings")
public class SpiritlingController {
    private final SpiritlingService spiritlingService;
    
    public SpiritlingController(SpiritlingService spiritlingService) {
        this.spiritlingService = spiritlingService;
    }
    
    @PostMapping
    public ResponseEntity<SpiritlingResponse> createSpiritling(
        @Valid @RequestBody SpiritlingCreateRequest request,
        Authentication authentication
    ) {
        String userId = authentication.getName();
        SpiritlingResponse response = spiritlingService.createSpiritling(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping
    public ResponseEntity<List<SpiritlingResponse>> getSpiritlings(Authentication authentication) {
        String userId = authentication.getName();
        List<SpiritlingResponse> spiritlings = spiritlingService.getSpiritlingsByUserId(userId);
        return ResponseEntity.ok(spiritlings);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SpiritlingResponse> getSpiritling(
        @PathVariable String id,
        Authentication authentication
    ) {
        String userId = authentication.getName();
        SpiritlingResponse response = spiritlingService.getSpiritlingById(id, userId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{id}/feed")
    public ResponseEntity<SpiritlingResponse> feedSpiritling(
        @PathVariable String id,
        Authentication authentication
    ) {
        String userId = authentication.getName();
        SpiritlingResponse response = spiritlingService.feedSpiritling(id, userId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{id}/play")
    public ResponseEntity<SpiritlingResponse> playWithSpiritling(
        @PathVariable String id,
        Authentication authentication
    ) {
        String userId = authentication.getName();
        SpiritlingResponse response = spiritlingService.playWithSpiritling(id, userId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{id}/heal")
    public ResponseEntity<SpiritlingResponse> healSpiritling(
        @PathVariable String id,
        Authentication authentication
    ) {
        String userId = authentication.getName();
        SpiritlingResponse response = spiritlingService.healSpiritling(id, userId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{id}/clean")
    public ResponseEntity<SpiritlingResponse> cleanSpiritling(
        @PathVariable String id,
        Authentication authentication
    ) {
        String userId = authentication.getName();
        SpiritlingResponse response = spiritlingService.cleanSpiritling(id, userId);
        return ResponseEntity.ok(response);
    }
    
        @PostMapping("/{id}/train")
        public ResponseEntity<SpiritlingResponse> trainSpiritling(
            @PathVariable String id,
            @RequestParam String stat_type,
            Authentication authentication
        ) {
            String userId = authentication.getName();
            SpiritlingResponse response = spiritlingService.trainSpiritling(id, userId, stat_type);
            return ResponseEntity.ok(response);
        }

        @PostMapping("/{id}/assign-task")
        public ResponseEntity<SpiritlingResponse> assignTask(
            @PathVariable String id,
            @RequestBody Map<String, String> request,
            Authentication authentication
        ) {
            String userId = authentication.getName();
            String task = request.get("task");
            if (task == null || task.isEmpty()) {
                throw new RuntimeException("작업을 지정해주세요.");
            }
            SpiritlingResponse response = spiritlingService.assignTask(id, userId, task);
            return ResponseEntity.ok(response);
        }
    }

