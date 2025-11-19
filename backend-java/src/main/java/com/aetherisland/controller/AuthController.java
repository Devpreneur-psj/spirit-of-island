package com.aetherisland.controller;

import com.aetherisland.dto.*;
import com.aetherisland.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserCreateRequest request) {
        System.out.println("📝 회원가입 요청 받음: " + request.getUsername() + ", " + request.getEmail());
        try {
            UserResponse response = authService.register(request);
            System.out.println("✅ 회원가입 성공: " + response.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            System.out.println("❌ 회원가입 오류: " + e.getMessage());
            throw e;
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody UserLoginRequest request) {
        System.out.println("🔐 로그인 시도: " + request.getUsername());
        try {
            TokenResponse response = authService.login(request);
            System.out.println("✅ 로그인 성공: " + request.getUsername());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("❌ 로그인 오류: " + e.getMessage());
            throw e;
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        String userId = authentication.getName();
        UserResponse response = authService.getCurrentUser(userId);
        return ResponseEntity.ok(response);
    }
}

