package com.example.economy.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "purchases", indexes = {
        @Index(name = "idx_purchases_user_purchased_at", columnList = "user_id, purchased_at"),
        @Index(name = "idx_purchases_item_name", columnList = "item_name")
})
public class Purchase {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String userId;

    private String itemName;

    private Integer price;

    private LocalDateTime purchasedAt = LocalDateTime.now();
}
