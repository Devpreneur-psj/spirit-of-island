package com.aetherisland.controller;

import com.aetherisland.dto.UserItemResponse;
import com.aetherisland.service.UserItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user-items")
public class UserItemController {
    private final UserItemService userItemService;
    
    public UserItemController(UserItemService userItemService) {
        this.userItemService = userItemService;
    }
    
    @GetMapping
    public ResponseEntity<List<UserItemResponse>> getUserItems(Authentication authentication) {
        String userId = authentication.getName();
        List<UserItemResponse> items = userItemService.getUserItems(userId);
        return ResponseEntity.ok(items);
    }
    
    @PostMapping("/{itemId}/buy")
    public ResponseEntity<Map<String, Object>> buyItem(
        @PathVariable String itemId,
        @RequestParam(defaultValue = "1") Integer quantity,
        Authentication authentication
    ) {
        String userId = authentication.getName();
        Map<String, Object> response = userItemService.buyItem(userId, itemId, quantity);
        return ResponseEntity.ok(response);
    }
}

