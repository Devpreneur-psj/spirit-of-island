package com.aetherisland.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String type;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> effect;
    
    @Column(nullable = false)
    private Integer price = 0;
    
    @Column(nullable = false)
    private String rarity = "common";
    
    // Getters and Setters
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

