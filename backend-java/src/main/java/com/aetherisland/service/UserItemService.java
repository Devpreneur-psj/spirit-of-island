package com.aetherisland.service;

import com.aetherisland.dto.SpiritlingResponse;
import com.aetherisland.dto.UserItemResponse;
import com.aetherisland.entity.ActionLog;
import com.aetherisland.entity.Item;
import com.aetherisland.entity.Spiritling;
import com.aetherisland.entity.User;
import com.aetherisland.entity.UserItem;
import com.aetherisland.exception.ApiException;
import com.aetherisland.repository.ActionLogRepository;
import com.aetherisland.repository.ItemRepository;
import com.aetherisland.repository.SpiritlingRepository;
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
    private final SpiritlingRepository spiritlingRepository;
    private final ActionLogRepository actionLogRepository;
    
    public UserItemService(UserItemRepository userItemRepository, ItemRepository itemRepository, 
                          UserRepository userRepository, SpiritlingRepository spiritlingRepository,
                          ActionLogRepository actionLogRepository) {
        this.userItemRepository = userItemRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.spiritlingRepository = spiritlingRepository;
        this.actionLogRepository = actionLogRepository;
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
    
    @Transactional
    public Map<String, Object> useItem(String userId, String itemId, String spiritlingId, Integer quantity) {
        // 사용자 아이템 확인
        UserItem userItem = userItemRepository.findByUserIdAndItemId(userId, itemId)
            .orElseThrow(() -> new ApiException("아이템이 부족합니다.", HttpStatus.BAD_REQUEST));
        
        if (userItem.getQuantity() < quantity) {
            throw new ApiException("아이템이 부족합니다.", HttpStatus.BAD_REQUEST);
        }
        
        // 아이템 정보 가져오기
        Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new ApiException("아이템을 찾을 수 없습니다.", HttpStatus.NOT_FOUND));
        
        // 마정령 확인
        Spiritling spiritling = spiritlingRepository.findById(spiritlingId)
            .orElseThrow(() -> new ApiException("마정령을 찾을 수 없습니다.", HttpStatus.NOT_FOUND));
        
        if (!spiritling.getUserId().equals(userId)) {
            throw new ApiException("마정령을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
        }
        
        // 아이템 효과 적용
        Map<String, Object> effect = item.getEffect();
        if (effect != null) {
            if (effect.containsKey("stat")) {
                String statName = (String) effect.get("stat");
                Integer value = ((Number) effect.get("value")).intValue() * quantity;
                applyStatEffect(spiritling, statName, value);
            }
            
            if (effect.containsKey("status")) {
                String statusName = (String) effect.get("status");
                Integer value = ((Number) effect.get("value")).intValue() * quantity;
                applyStatusEffect(spiritling, statusName, value);
            }
        }
        
        // 경험치 증가
        spiritling.setExperience(spiritling.getExperience() + 2 * quantity);
        
        // 레벨 업 체크
        checkLevelUp(spiritling);
        
        // 행동 로그 생성
        String message = spiritling.getName() + "에게 " + item.getName() + " " + quantity + "개를 사용했습니다.";
        createActionLog(spiritling.getId(), "use_item", message);
        
        // 아이템 수량 감소
        userItem.setQuantity(userItem.getQuantity() - quantity);
        if (userItem.getQuantity() <= 0) {
            userItemRepository.delete(userItem);
        } else {
            userItemRepository.save(userItem);
        }
        
        spiritlingRepository.save(spiritling);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", item.getName() + " " + quantity + "개를 사용했습니다.");
        response.put("spiritling", toSpiritlingResponse(spiritling));
        
        return response;
    }
    
    private void applyStatEffect(Spiritling spiritling, String statName, Integer value) {
        switch (statName) {
            case "health":
                spiritling.setHealthStat(Math.min(100, spiritling.getHealthStat() + value));
                break;
            case "agility":
                spiritling.setAgilityStat(Math.min(100, spiritling.getAgilityStat() + value));
                break;
            case "intelligence":
                spiritling.setIntelligenceStat(Math.min(100, spiritling.getIntelligenceStat() + value));
                break;
            case "friendliness":
                spiritling.setFriendlinessStat(Math.min(100, spiritling.getFriendlinessStat() + value));
                break;
            case "resilience":
                spiritling.setResilienceStat(Math.min(100, spiritling.getResilienceStat() + value));
                break;
            case "luck":
                spiritling.setLuckStat(Math.min(100, spiritling.getLuckStat() + value));
                break;
        }
    }
    
    private void applyStatusEffect(Spiritling spiritling, String statusName, Integer value) {
        switch (statusName) {
            case "hunger":
                spiritling.setHunger(Math.min(100, spiritling.getHunger() + value));
                break;
            case "happiness":
                spiritling.setHappiness(Math.min(100, spiritling.getHappiness() + value));
                break;
            case "energy":
                spiritling.setEnergy(Math.min(100, spiritling.getEnergy() + value));
                break;
            case "health":
                spiritling.setHealthStatus(Math.min(100, spiritling.getHealthStatus() + value));
                break;
            case "cleanliness":
                spiritling.setCleanliness(Math.min(100, spiritling.getCleanliness() + value));
                break;
        }
    }
    
    private void checkLevelUp(Spiritling spiritling) {
        int requiredExp = spiritling.getLevel() * 100;
        if (spiritling.getExperience() >= requiredExp) {
            spiritling.setLevel(spiritling.getLevel() + 1);
            spiritling.setExperience(0);
            
            // 레벨업 시 모든 스탯 증가
            spiritling.setHealthStat(Math.min(100, spiritling.getHealthStat() + 1));
            spiritling.setAgilityStat(Math.min(100, spiritling.getAgilityStat() + 1));
            spiritling.setIntelligenceStat(Math.min(100, spiritling.getIntelligenceStat() + 1));
            spiritling.setFriendlinessStat(Math.min(100, spiritling.getFriendlinessStat() + 1));
            spiritling.setResilienceStat(Math.min(100, spiritling.getResilienceStat() + 1));
            spiritling.setLuckStat(Math.min(100, spiritling.getLuckStat() + 1));
            
            // 성장 단계 업데이트
            if (spiritling.getLevel() >= 50) {
                spiritling.setGrowthStage("elder");
            } else if (spiritling.getLevel() >= 40) {
                spiritling.setGrowthStage("transcendent");
            } else if (spiritling.getLevel() >= 25) {
                spiritling.setGrowthStage("adult");
            } else if (spiritling.getLevel() >= 15) {
                spiritling.setGrowthStage("adolescent");
            } else if (spiritling.getLevel() >= 5) {
                spiritling.setGrowthStage("infant");
            }
            
            createActionLog(spiritling.getId(), "level_up", 
                spiritling.getName() + "가 레벨 " + spiritling.getLevel() + "로 성장했습니다!");
        }
    }
    
    private void createActionLog(String spiritlingId, String actionType, String message) {
        ActionLog log = new ActionLog();
        log.setId(UUID.randomUUID().toString());
        log.setSpiritlingId(spiritlingId);
        log.setActionType(actionType);
        log.setAction(actionType);
        log.setMessage(message);
        actionLogRepository.save(log);
    }
    
    private SpiritlingResponse toSpiritlingResponse(Spiritling spiritling) {
        return new SpiritlingResponse(
            spiritling.getId(),
            spiritling.getName(),
            spiritling.getElement(),
            spiritling.getPersonality(),
            spiritling.getGrowthStage(),
            spiritling.getLevel(),
            spiritling.getExperience(),
            spiritling.getHealthStat(),
            spiritling.getAgilityStat(),
            spiritling.getIntelligenceStat(),
            spiritling.getFriendlinessStat(),
            spiritling.getResilienceStat(),
            spiritling.getLuckStat(),
            spiritling.getHunger(),
            spiritling.getHappiness(),
            spiritling.getEnergy(),
            spiritling.getHealthStatus(),
            spiritling.getCleanliness(),
            spiritling.getCurrentAction(),
            spiritling.getActionData(),
            spiritling.getUserId(),
            spiritling.getCreatedAt(),
            spiritling.getUpdatedAt()
        );
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

