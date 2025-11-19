package com.aetherisland.service;

import com.aetherisland.dto.*;
import com.aetherisland.entity.User;
import com.aetherisland.repository.UserRepository;
import com.aetherisland.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    
    @Transactional
    public UserResponse register(UserCreateRequest request) {
        // 사용자 이름 중복 확인
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("이미 존재하는 사용자 이름입니다.");
        }
        
        // 이메일 중복 확인
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        
        // 새 사용자 생성
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setHashedPassword(passwordEncoder.encode(request.getPassword()));
        user.setCoins(1000);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        
        return new UserResponse(
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getEmail(),
            savedUser.getCoins(),
            savedUser.getCreatedAt()
        );
    }
    
    public TokenResponse login(UserLoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("사용자 이름 또는 비밀번호가 올바르지 않습니다."));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getHashedPassword())) {
            throw new RuntimeException("사용자 이름 또는 비밀번호가 올바르지 않습니다.");
        }
        
        String token = jwtTokenProvider.generateToken(user.getId());
        
        return new TokenResponse(token, "bearer");
    }
    
    public UserResponse getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getCoins(),
            user.getCreatedAt()
        );
    }
}

