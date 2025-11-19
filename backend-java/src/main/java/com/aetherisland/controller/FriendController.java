package com.aetherisland.controller;

import com.aetherisland.dto.FriendResponse;
import com.aetherisland.entity.Friend;
import com.aetherisland.entity.User;
import com.aetherisland.repository.FriendRepository;
import com.aetherisland.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/friends")
public class FriendController {
    private final FriendRepository friendRepository;
    private final UserRepository userRepository;
    
    public FriendController(FriendRepository friendRepository, UserRepository userRepository) {
        this.friendRepository = friendRepository;
        this.userRepository = userRepository;
    }
    
    @GetMapping
    public ResponseEntity<List<FriendResponse>> getFriends(Authentication authentication) {
        String userId = authentication.getName();
        
        // 보낸 요청 중 accepted인 것들
        List<Friend> sentFriends = friendRepository.findByUserIdAndStatus(userId, "accepted");
        
        // 받은 요청 중 accepted인 것들
        List<Friend> receivedFriends = friendRepository.findByFriendIdAndStatus(userId, "accepted");
        
        List<FriendResponse> responses = sentFriends.stream()
            .map(f -> {
                User friendUser = userRepository.findById(f.getFriendId()).orElse(null);
                if (friendUser == null) return null;
                return new FriendResponse(
                    f.getId(),
                    f.getUserId(),
                    f.getFriendId(),
                    friendUser.getUsername(),
                    friendUser.getEmail(),
                    f.getStatus(),
                    f.getCreatedAt()
                );
            })
            .filter(f -> f != null)
            .collect(Collectors.toList());
        
        responses.addAll(receivedFriends.stream()
            .map(f -> {
                User friendUser = userRepository.findById(f.getUserId()).orElse(null);
                if (friendUser == null) return null;
                return new FriendResponse(
                    f.getId(),
                    f.getUserId(),
                    f.getFriendId(),
                    friendUser.getUsername(),
                    friendUser.getEmail(),
                    f.getStatus(),
                    f.getCreatedAt()
                );
            })
            .filter(f -> f != null)
            .collect(Collectors.toList()));
        
        return ResponseEntity.ok(responses);
    }
}

