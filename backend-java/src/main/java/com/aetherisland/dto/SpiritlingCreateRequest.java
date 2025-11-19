package com.aetherisland.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpiritlingCreateRequest {
    @NotBlank(message = "이름은 필수입니다")
    private String name;
    
    @NotBlank(message = "속성은 필수입니다")
    private String element;
    
    @NotBlank(message = "성격은 필수입니다")
    private String personality;
}

