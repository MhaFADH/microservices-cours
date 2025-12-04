package com.example.matchmaking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "matches")
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
