package com.aetherisland.service;

import com.aetherisland.dto.UserItemResponse;
import com.aetherisland.entity.Item;
import com.aetherisland.entity.User;
import com.aetherisland.entity.UserItem;
import com.aetherisland.exception.ApiException;
import com.aetherisland.repository.ItemRepository;
import com.aetherisland.repository.UserItemRepository;
import com.aetherisland.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserItemService {
    private final UserItemRepository userItemRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    
    public UserItemService(UserItemRepository userItemRepository, ItemRepository itemRepository, UserRepository userRepository) {
        this.userItemRepository = userItemRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }
    
    public List<UserItemResponse> getUserItems(String userId) {
        List<UserItem> userItems = userItemRepository.findByUserId(userId);
        return userItems.stream()
            .map(userItem -> {
                Item item = itemRepository.findById(userItem.getItemId())
                    .orElse(null);
                if (item == null) {
                    return null;
                }
                return toResponse(userItem, item);
            })
            .filter(response -> response != null)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public Map<String, Object> buyItem(String userId, String itemId, Integer quantity) {
        Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new ApiException("아이템을 찾을 수 없습니다.", HttpStatus.NOT_FOUND));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ApiException("사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND));
        
        Integer totalPrice = item.getPrice() * quantity;
        if (user.getCoins() < totalPrice) {
            throw new ApiException(
                String.format("코인이 부족합니다. 필요: %d, 보유: %d", totalPrice, user.getCoins()),
                HttpStatus.BAD_REQUEST
            );
        }
        
        // 코인 차감
        user.setCoins(user.getCoins() - totalPrice);
        userRepository.save(user);
        
        // 사용자 아이템 추가 또는 수량 증가
        UserItem userItem = userItemRepository.findByUserIdAndItemId(userId, itemId)
            .orElse(null);
        
        if (userItem != null) {
            userItem.setQuantity(userItem.getQuantity() + quantity);
        } else {
            userItem = new UserItem();
            userItem.setId(UUID.randomUUID().toString());
            userItem.setUserId(userId);
            userItem.setItemId(itemId);
            userItem.setQuantity(quantity);
        }
        
        userItemRepository.save(userItem);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", String.format("%s %d개를 구매했습니다.", item.getName(), quantity));
        response.put("coins", user.getCoins());
        
        Map<String, Object> itemData = new HashMap<>();
        itemData.put("id", userItem.getId());
        itemData.put("item_id", item.getId());
        itemData.put("name", item.getName());
        itemData.put("quantity", userItem.getQuantity());
        response.put("item", itemData);
        
        return response;
    }
    
    private UserItemResponse toResponse(UserItem userItem, Item item) {
        return new UserItemResponse(
            userItem.getId(),
            item.getId(),
            item.getName(),
            item.getType(),
            item.getDescription(),
            item.getEffect(),
            item.getPrice(),
            item.getRarity(),
            userItem.getQuantity()
        );
    }
}

