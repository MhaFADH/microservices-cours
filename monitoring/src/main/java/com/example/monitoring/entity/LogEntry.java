package com.example.monitoring.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "log_entries")
public class LogEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String serviceUrl;

    private String timestamp;

    private String level;

    @Column(length = 1000)
    private String message;

    private LocalDateTime collectedAt = LocalDateTime.now();

    public LogEntry(String serviceUrl, String timestamp, String level, String message) {
        this.serviceUrl = serviceUrl;
        this.timestamp = timestamp;
        this.level = level;
        this.message = message;
    }
}
