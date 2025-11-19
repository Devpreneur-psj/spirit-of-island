package com.aetherisland.controller;

import com.aetherisland.dto.*;
import com.aetherisland.service.AuthService;
import com.aetherisland.service.SpiritlingSimulationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;
    private final SpiritlingSimulationService simulationService;
    
    public AuthController(AuthService authService, SpiritlingSimulationService simulationService) {
        this.authService = authService;
        this.simulationService = simulationService;
    }
    
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserCreateRequest request) {
        System.out.println("📝 회원가입 요청 받음: " + request.getUsername() + ", " + request.getEmail());
        UserResponse response = authService.register(request);
        System.out.println("✅ 회원가입 성공: " + response.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody UserLoginRequest request) {
        System.out.println("🔐 로그인 시도: " + request.getUsername());
        TokenResponse response = authService.login(request);
        System.out.println("✅ 로그인 성공: " + request.getUsername());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        String userId = authentication.getName();
        // 로그인 시 오프라인 동안의 정령 시뮬레이션 실행
        simulationService.simulateUserSpiritlings(userId);
        UserResponse response = authService.getCurrentUser(userId);
        return ResponseEntity.ok(response);
    }
}

