package com.example.matchmaking.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "queue", indexes = {
        @Index(name = "idx_queue_mmr_joined_at", columnList = "mmr, joined_at"),
        @Index(name = "idx_queue_joined_at", columnList = "joined_at")
})
public class QueueEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true)
    private String playerId;

    private Integer mmr;

    private LocalDateTime joinedAt = LocalDateTime.now();
}
