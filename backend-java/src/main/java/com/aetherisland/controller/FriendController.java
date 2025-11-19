package com.aetherisland.controller;

import com.aetherisland.dto.FriendResponse;
import com.aetherisland.entity.Friend;
import com.aetherisland.entity.User;
import com.aetherisland.exception.ApiException;
import com.aetherisland.repository.FriendRepository;
import com.aetherisland.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
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
    
    @PostMapping
    public ResponseEntity<FriendResponse> sendFriendRequest(
        @RequestBody Map<String, String> request,
        Authentication authentication
    ) {
        String userId = authentication.getName();
        String friendId = request.get("friend_id");
        
        if (userId.equals(friendId)) {
            throw new ApiException("자기 자신에게 친구 요청을 보낼 수 없습니다.", HttpStatus.BAD_REQUEST);
        }
        
        User friendUser = userRepository.findById(friendId)
            .orElseThrow(() -> new ApiException("사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND));
        
        Optional<Friend> existing = friendRepository.findFriendRelationship(userId, friendId);
        if (existing.isPresent()) {
            Friend f = existing.get();
            if ("accepted".equals(f.getStatus())) {
                throw new ApiException("이미 친구입니다.", HttpStatus.BAD_REQUEST);
            } else if ("pending".equals(f.getStatus())) {
                if (f.getUserId().equals(userId)) {
                    throw new ApiException("이미 친구 요청을 보냈습니다.", HttpStatus.BAD_REQUEST);
                } else {
                    throw new ApiException("이미 친구 요청을 받았습니다. 요청을 수락해주세요.", HttpStatus.BAD_REQUEST);
                }
            } else if ("blocked".equals(f.getStatus())) {
                throw new ApiException("친구 요청을 보낼 수 없습니다.", HttpStatus.FORBIDDEN);
            }
        }
        
        Friend friend = new Friend();
        friend.setId(UUID.randomUUID().toString());
        friend.setUserId(userId);
        friend.setFriendId(friendId);
        friend.setStatus("pending");
        friend.setCreatedAt(LocalDateTime.now());
        friend.setUpdatedAt(LocalDateTime.now());
        
        Friend saved = friendRepository.save(friend);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved, friendUser));
    }
    
    @GetMapping("/requests")
    public ResponseEntity<List<Map<String, Object>>> getFriendRequests(Authentication authentication) {
        String userId = authentication.getName();
        List<Friend> requests = friendRepository.findPendingRequestsByFriendId(userId);
        
        List<Map<String, Object>> result = requests.stream()
            .map(f -> {
                User user = userRepository.findById(f.getUserId()).orElse(null);
                if (user == null) return null;
                Map<String, Object> item = new HashMap<>();
                item.put("id", f.getId());
                item.put("user_id", f.getUserId());
                item.put("friend_id", f.getFriendId());
                item.put("username", user.getUsername());
                item.put("email", user.getEmail());
                item.put("status", f.getStatus());
                item.put("created_at", f.getCreatedAt());
                return item;
            })
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping
    public ResponseEntity<List<FriendResponse>> getFriends(Authentication authentication) {
        String userId = authentication.getName();
        
        List<Friend> sentFriends = friendRepository.findByUserIdAndStatus(userId, "accepted");
        List<Friend> receivedFriends = friendRepository.findByFriendIdAndStatus(userId, "accepted");
        
        List<FriendResponse> responses = sentFriends.stream()
            .map(f -> {
                User friendUser = userRepository.findById(f.getFriendId()).orElse(null);
                if (friendUser == null) return null;
                return toResponse(f, friendUser);
            })
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
        
        responses.addAll(receivedFriends.stream()
            .map(f -> {
                User friendUser = userRepository.findById(f.getUserId()).orElse(null);
                if (friendUser == null) return null;
                return toResponse(f, friendUser);
            })
            .filter(Objects::nonNull)
            .collect(Collectors.toList()));
        
        return ResponseEntity.ok(responses);
    }
    
    @PostMapping("/accept")
    public ResponseEntity<FriendResponse> acceptFriendRequest(
        @RequestBody Map<String, String> request,
        Authentication authentication
    ) {
        String userId = authentication.getName();
        String requestId = request.get("friend_request_id");
        
        Friend friendRequest = friendRepository.findById(requestId)
            .orElseThrow(() -> new ApiException("친구 요청을 찾을 수 없습니다.", HttpStatus.NOT_FOUND));
        
        if (!friendRequest.getFriendId().equals(userId) || !"pending".equals(friendRequest.getStatus())) {
            throw new ApiException("친구 요청을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
        }
        
        friendRequest.setStatus("accepted");
        friendRequest.setUpdatedAt(LocalDateTime.now());
        Friend saved = friendRepository.save(friendRequest);
        
        User friendUser = userRepository.findById(friendRequest.getUserId())
            .orElseThrow(() -> new ApiException("사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND));
        
        return ResponseEntity.ok(toResponse(saved, friendUser));
    }
    
    @PostMapping("/reject")
    public ResponseEntity<Void> rejectFriendRequest(
        @RequestBody Map<String, String> request,
        Authentication authentication
    ) {
        String userId = authentication.getName();
        String requestId = request.get("friend_request_id");
        
        Friend friendRequest = friendRepository.findById(requestId)
            .orElseThrow(() -> new ApiException("친구 요청을 찾을 수 없습니다.", HttpStatus.NOT_FOUND));
        
        if (!friendRequest.getFriendId().equals(userId) || !"pending".equals(friendRequest.getStatus())) {
            throw new ApiException("친구 요청을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
        }
        
        friendRepository.delete(friendRequest);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/{friendId}")
    public ResponseEntity<Void> removeFriend(
        @PathVariable String friendId,
        Authentication authentication
    ) {
        String userId = authentication.getName();
        
        Optional<Friend> relationship = friendRepository.findFriendRelationship(userId, friendId);
        if (relationship.isEmpty() || !"accepted".equals(relationship.get().getStatus())) {
            throw new ApiException("친구 관계를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
        }
        
        friendRepository.delete(relationship.get());
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchUsers(
        @RequestParam String username,
        Authentication authentication
    ) {
        String userId = authentication.getName();
        List<User> users = userRepository.findByUsernameContainingIgnoreCase(username)
            .stream()
            .filter(u -> !u.getId().equals(userId))
            .limit(10)
            .collect(Collectors.toList());
        
        Set<String> friendIds = new HashSet<>();
        friendRepository.findAll().forEach(f -> {
            if (f.getUserId().equals(userId)) friendIds.add(f.getFriendId());
            if (f.getFriendId().equals(userId)) friendIds.add(f.getUserId());
        });
        
        List<Map<String, Object>> result = users.stream()
            .map(user -> {
                Map<String, Object> item = new HashMap<>();
                item.put("id", user.getId());
                item.put("username", user.getUsername());
                item.put("email", user.getEmail());
                item.put("is_friend", friendIds.contains(user.getId()));
                
                Optional<Friend> friendRequest = friendRepository.findFriendRelationship(userId, user.getId());
                item.put("friend_status", friendRequest.map(Friend::getStatus).orElse(null));
                
                return item;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }
    
    private FriendResponse toResponse(Friend friend, User friendUser) {
        return new FriendResponse(
            friend.getId(),
            friend.getUserId(),
            friend.getFriendId(),
            friendUser.getUsername(),
            friendUser.getEmail(),
            friend.getStatus(),
            friend.getCreatedAt()
        );
    }
}

