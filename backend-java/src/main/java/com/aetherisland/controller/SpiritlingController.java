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
}

