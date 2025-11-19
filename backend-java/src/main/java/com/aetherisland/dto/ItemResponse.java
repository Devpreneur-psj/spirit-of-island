package com.aetherisland.dto;

import java.util.Map;

public class ItemResponse {
    private String id;
    private String name;
    private String type;
    private String description;
    private Map<String, Object> effect;
    private Integer price;
    private String rarity;
    
    public ItemResponse() {}
    
    public ItemResponse(String id, String name, String type, String description, Map<String, Object> effect, Integer price, String rarity) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.effect = effect;
        this.price = price;
        this.rarity = rarity;
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Map<String, Object> getEffect() { return effect; }
    public void setEffect(Map<String, Object> effect) { this.effect = effect; }
    public Integer getPrice() { return price; }
    public void setPrice(Integer price) { this.price = price; }
    public String getRarity() { return rarity; }
    public void setRarity(String rarity) { this.rarity = rarity; }
}

