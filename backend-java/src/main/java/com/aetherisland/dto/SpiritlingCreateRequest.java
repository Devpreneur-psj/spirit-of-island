package com.aetherisland.dto;

import jakarta.validation.constraints.NotBlank;

public class SpiritlingCreateRequest {
    @NotBlank(message = "이름은 필수입니다")
    private String name;
    
    @NotBlank(message = "속성은 필수입니다")
    private String element;
    
    @NotBlank(message = "성격은 필수입니다")
    private String personality;
    
    public SpiritlingCreateRequest() {}
    
    public SpiritlingCreateRequest(String name, String element, String personality) {
        this.name = name;
        this.element = element;
        this.personality = personality;
    }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getElement() { return element; }
    public void setElement(String element) { this.element = element; }
    public String getPersonality() { return personality; }
    public void setPersonality(String personality) { this.personality = personality; }
}

