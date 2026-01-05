package com.example.economy.service;

import com.example.economy.dto.PurchaseDTO;
import com.example.economy.entity.Purchase;
import com.example.economy.repository.PurchaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final IdentityClient identityClient;
    private final LogService logService;
    private final MetricsService metricsService;

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

    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findAll();
    }

    public Purchase getPurchaseById(String id) {
        return purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found"));
    }

    public List<Purchase> getUserPurchases(String userId) {
        return purchaseRepository.findByUserId(userId);
    }
}
