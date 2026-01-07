package com.example.economy.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.example.economy.dto.PurchaseDTO;
import com.example.economy.entity.Purchase;
import com.example.economy.repository.PurchaseRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final IdentityClient identityClient;
    private final LogService logService;
    private final MetricsService metricsService;

    @CacheEvict(value = { "allPurchases", "userPurchases" }, allEntries = true)
    public Purchase createPurchase(PurchaseDTO dto) {
        identityClient.getUserById(dto.getUserId());

        Purchase purchase = new Purchase();
        purchase.setUserId(dto.getUserId());
        purchase.setItemName(dto.getItemName());
        purchase.setPrice(dto.getPrice());
        purchaseRepository.save(purchase);

        logService.log("INFO", "Purchase created: " + dto.getItemName() + " for user " + dto.getUserId());

        return purchase;
    }

    @Cacheable(value = "allPurchases")
     public Page<Purchase> getAllPurchases(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);

        return purchaseRepository.findAll(pageable);
    }

    @Cacheable(value = "purchases", key = "#id")
    public Purchase getPurchaseById(String id) {
        return purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found"));
    }

    @Cacheable(value = "userPurchases", key = "#userId")
    public List<Purchase> getUserPurchases(String userId) {
        return purchaseRepository.findByUserId(userId);
    }
}
