package com.aetherisland.controller;

import com.aetherisland.dto.ItemResponse;
import com.aetherisland.entity.Item;
import com.aetherisland.repository.ItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/items")
public class ItemController {
    private final ItemRepository itemRepository;
    
    public ItemController(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }
    
    @GetMapping
    public ResponseEntity<List<ItemResponse>> getItems() {
        List<Item> items = itemRepository.findAll();
        List<ItemResponse> responses = items.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getItem(@PathVariable String id) {
        Item item = itemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("아이템을 찾을 수 없습니다."));
        return ResponseEntity.ok(toResponse(item));
    }
    
    private ItemResponse toResponse(Item item) {
        return new ItemResponse(
            item.getId(),
            item.getName(),
            item.getType(),
            item.getDescription(),
            item.getEffect(),
            item.getPrice(),
            item.getRarity()
        );
    }
}

