package com.example.matchmaking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "queue")
public class QueueEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true)
    private String playerId;

    private Integer mmr;

    private LocalDateTime joinedAt = LocalDateTime.now();
}
