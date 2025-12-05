package com.example.economy.service;

import com.example.economy.repository.PostRepository;
import com.example.economy.repository.PurchaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class MetricsService {
    private final PostRepository postRepository;
    private final PurchaseRepository purchaseRepository;
    private final AtomicInteger activeUsers = new AtomicInteger(0);
    private final long startTime = System.currentTimeMillis();

    public void incrementActiveUsers() {
        activeUsers.incrementAndGet();
    }

    public void decrementActiveUsers() {
        activeUsers.updateAndGet(current -> Math.max(0, current - 1));
    }

    public Map<String, Object> getMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        long uptime = (System.currentTimeMillis() - startTime) / 1000;
        metrics.put("uptime", uptime);
        metrics.put("activeUsers", activeUsers.get());
        metrics.put("totalPurchases", purchaseRepository.count());
        metrics.put("totalPosts", postRepository.count());
        metrics.put("endpointCount", 10);
        return metrics;
    }
}
