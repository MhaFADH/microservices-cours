package com.example.matchmaking.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class MetricsService {
    private final AtomicInteger activeMatches = new AtomicInteger(0);
    private final AtomicInteger queueSize = new AtomicInteger(0);
    private final long startTime = System.currentTimeMillis();

    public void incrementActiveMatches() {
        activeMatches.incrementAndGet();
    }

    public void decrementActiveMatches() {
        activeMatches.decrementAndGet();
    }

    public void setQueueSize(int size) {
        queueSize.set(size);
    }

    public Map<String, Object> getMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        long uptime = (System.currentTimeMillis() - startTime) / 1000;
        metrics.put("uptime", uptime);
        metrics.put("activeMatches", activeMatches.get());
        metrics.put("queueSize", queueSize.get());
        metrics.put("endpointCount", 7);
        return metrics;
    }
}
