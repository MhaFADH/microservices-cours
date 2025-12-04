package com.example.monitoring.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class MetricsService {
    private final long startTime = System.currentTimeMillis();

    public Map<String, Object> getMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        long uptime = (System.currentTimeMillis() - startTime) / 1000;
        metrics.put("uptime", uptime);
        metrics.put("status", "running");
        metrics.put("endpointCount", 5);
        return metrics;
    }
}
