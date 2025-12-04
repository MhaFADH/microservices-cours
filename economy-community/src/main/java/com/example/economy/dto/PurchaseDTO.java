package com.example.economy.dto;

import lombok.Data;

@Data
public class PurchaseDTO {
    private String userId;
    private String itemName;
    private Integer price;
}
