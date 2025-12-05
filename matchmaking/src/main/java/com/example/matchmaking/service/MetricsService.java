package com.example.matchmaking.service;

import com.example.matchmaking.repository.MatchRepository;
import com.example.matchmaking.repository.QueueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class MetricsService {
    private final MatchRepository matchRepository;
    private final QueueRepository queueRepository;
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
        metrics.put("totalMatches", matchRepository.count());
        metrics.put("queueSize", queueRepository.count());
        metrics.put("endpointCount", 7);
        return metrics;
    }
}
