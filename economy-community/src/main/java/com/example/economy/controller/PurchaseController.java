package com.example.economy.controller;

import com.example.economy.dto.PurchaseDTO;
import com.example.economy.entity.Purchase;
import com.example.economy.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;

    @PostMapping
    public ResponseEntity<Purchase> createPurchase(@RequestBody PurchaseDTO dto) {
        Purchase purchase = purchaseService.createPurchase(dto);
        return ResponseEntity.ok(purchase);
    }

    @GetMapping
    public ResponseEntity<List<Purchase>> getAllPurchases() {
        return ResponseEntity.ok(purchaseService.getAllPurchases());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Purchase> getPurchaseById(@PathVariable String id) {
        return ResponseEntity.ok(purchaseService.getPurchaseById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Purchase>> getUserPurchases(@PathVariable String userId) {
        return ResponseEntity.ok(purchaseService.getUserPurchases(userId));
    }
}
