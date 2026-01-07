package com.example.matchmaking.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "matches", indexes = {
        @Index(name = "idx_matches_player1_created_at", columnList = "player1id, created_at"),
        @Index(name = "idx_matches_player2_created_at", columnList = "player2id, created_at"),
        @Index(name = "idx_matches_status_created_at", columnList = "status, created_at"),
        @Index(name = "idx_matches_status_completed_at", columnList = "status, completed_at"),
        @Index(name = "idx_matches_winner_id", columnList = "winner_id")
})
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String player1Id;
    private String player2Id;

    private String winnerId;

    private Integer player1MmrChange;
    private Integer player2MmrChange;

    @Enumerated(EnumType.STRING)
    private MatchStatus status = MatchStatus.IN_PROGRESS;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime completedAt;

    public enum MatchStatus {
        IN_PROGRESS, COMPLETED, CANCELLED
    }
}
