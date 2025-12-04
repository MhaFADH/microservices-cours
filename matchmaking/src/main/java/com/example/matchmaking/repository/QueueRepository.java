package com.example.matchmaking.repository;

import com.example.matchmaking.entity.QueueEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface QueueRepository extends JpaRepository<QueueEntry, String> {
    Optional<QueueEntry> findByPlayerId(String playerId);
    boolean existsByPlayerId(String playerId);
    void deleteByPlayerId(String playerId);
}
