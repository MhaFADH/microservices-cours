package com.example.economy.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class MetricsService {
    private final AtomicInteger totalPurchases = new AtomicInteger(0);
    private final AtomicInteger totalPosts = new AtomicInteger(0);
    private final long startTime = System.currentTimeMillis();

    public void incrementPurchases() {
        totalPurchases.incrementAndGet();
    }

    public void incrementPosts() {
        totalPosts.incrementAndGet();
    }

    public void decrementPosts() {
        totalPosts.decrementAndGet();
    }

    public Map<String, Object> getMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        long uptime = (System.currentTimeMillis() - startTime) / 1000;
        metrics.put("uptime", uptime);
        metrics.put("totalPurchases", totalPurchases.get());
        metrics.put("totalPosts", totalPosts.get());
        metrics.put("endpointCount", 10);
        return metrics;
    }
}
