package com.example.identity.service;

import org.springframework.stereotype.Service;
import java.lang.management.ManagementFactory;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class MetricsService {
    private final AtomicInteger activeUsers = new AtomicInteger(0);
    private final long startTime = System.currentTimeMillis();

    public void incrementActiveUsers() {
        activeUsers.incrementAndGet();
    }

    public void decrementActiveUsers() {
        activeUsers.decrementAndGet();
    }

    public Map<String, Object> getMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        long uptime = (System.currentTimeMillis() - startTime) / 1000;
        metrics.put("uptime", uptime);
        metrics.put("activeUsers", activeUsers.get());
        metrics.put("endpointCount", 8);
        return metrics;
    }
}
