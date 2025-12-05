package com.example.matchmaking.service;

import com.example.matchmaking.entity.QueueEntry;
import com.example.matchmaking.repository.QueueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class QueueService {

    private final QueueRepository queueRepository;
    private final IdentityClient identityClient;
    private final LogService logService;
    private final MetricsService metricsService;

    @Transactional
    public QueueEntry joinQueue(String playerId) {
        if (queueRepository.existsByPlayerId(playerId)) {
            logService.log("WARN", "Player already in queue: " + playerId);
            throw new RuntimeException("Player already in queue");
        }

        Map<String, Object> user = identityClient.getUserById(playerId);
        Integer mmr = (Integer) user.get("mmr");

        QueueEntry entry = new QueueEntry();
        entry.setPlayerId(playerId);
        entry.setMmr(mmr);
        queueRepository.save(entry);

        logService.log("INFO", "Player joined queue: " + playerId);

        return entry;
    }

    @Transactional
    public void leaveQueue(String playerId) {
        if (!queueRepository.existsByPlayerId(playerId)) {
            logService.log("WARN", "Player not in queue: " + playerId);
            throw new RuntimeException("Player not in queue");
        }

        queueRepository.deleteByPlayerId(playerId);
        logService.log("INFO", "Player left queue: " + playerId);
    }

    public List<QueueEntry> getQueue() {
        return queueRepository.findAll();
    }
}
