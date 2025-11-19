package com.aetherisland.dto;

public class UserItemResponse {
    private String id;
    private String itemId;
    private String name;
    private String type;
    private String description;
    private Object effect;
    private Integer price;
    private String rarity;
    private Integer quantity;
    
    public UserItemResponse() {}
    
    public UserItemResponse(String id, String itemId, String name, String type, String description, Object effect, Integer price, String rarity, Integer quantity) {
        this.id = id;
        this.itemId = itemId;
        this.name = name;
        this.type = type;
        this.description = description;
        this.effect = effect;
        this.price = price;
        this.rarity = rarity;
        this.quantity = quantity;
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Object getEffect() { return effect; }
    public void setEffect(Object effect) { this.effect = effect; }
    public Integer getPrice() { return price; }
    public void setPrice(Integer price) { this.price = price; }
    public String getRarity() { return rarity; }
    public void setRarity(String rarity) { this.rarity = rarity; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}

