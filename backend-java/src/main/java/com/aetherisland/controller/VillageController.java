package com.aetherisland.controller;

import com.aetherisland.entity.Friend;
import com.aetherisland.entity.User;
import com.aetherisland.repository.FriendRepository;
import com.aetherisland.repository.SpiritlingRepository;
import com.aetherisland.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/village")
public class VillageController {
    private final FriendRepository friendRepository;
    private final UserRepository userRepository;
    private final SpiritlingRepository spiritlingRepository;
    
    public VillageController(
        FriendRepository friendRepository,
        UserRepository userRepository,
        SpiritlingRepository spiritlingRepository
    ) {
        this.friendRepository = friendRepository;
        this.userRepository = userRepository;
        this.spiritlingRepository = spiritlingRepository;
    }
    
    @GetMapping("/friends")
    public ResponseEntity<List<Map<String, Object>>> getFriendsForVillage(Authentication authentication) {
        String userId = authentication.getName();
        
        // 보낸 요청 중 accepted인 것들
        List<Friend> sentFriends = friendRepository.findByUserIdAndStatus(userId, "accepted");
        
        // 받은 요청 중 accepted인 것들
        List<Friend> receivedFriends = friendRepository.findByFriendIdAndStatus(userId, "accepted");
        
        Map<String, Map<String, Object>> friendMap = new HashMap<>();
        
        // 보낸 요청의 친구들
        for (Friend friend : sentFriends) {
            User friendUser = userRepository.findById(friend.getFriendId()).orElse(null);
            if (friendUser != null) {
                long spiritlingCount = spiritlingRepository.countByUserId(friendUser.getId());
                Map<String, Object> friendData = new HashMap<>();
                friendData.put("id", friendUser.getId());
                friendData.put("username", friendUser.getUsername());
                friendData.put("email", friendUser.getEmail());
                friendData.put("spiritling_count", spiritlingCount);
                friendData.put("created_at", friendUser.getCreatedAt());
                friendMap.put(friendUser.getId(), friendData);
            }
        }
        
        // 받은 요청의 친구들 (중복 제거)
        for (Friend friend : receivedFriends) {
            User friendUser = userRepository.findById(friend.getUserId()).orElse(null);
            if (friendUser != null && !friendMap.containsKey(friendUser.getId())) {
                long spiritlingCount = spiritlingRepository.countByUserId(friendUser.getId());
                Map<String, Object> friendData = new HashMap<>();
                friendData.put("id", friendUser.getId());
                friendData.put("username", friendUser.getUsername());
                friendData.put("email", friendUser.getEmail());
                friendData.put("spiritling_count", spiritlingCount);
                friendData.put("created_at", friendUser.getCreatedAt());
                friendMap.put(friendUser.getId(), friendData);
            }
        }
        
        List<Map<String, Object>> result = friendMap.values().stream().collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }
}

