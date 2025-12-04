package com.example.monitoring.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "metrics")
public class Metric {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String serviceUrl;

    private String metricKey;

    private Double metricValue;

    private LocalDateTime collectedAt = LocalDateTime.now();

    public Metric(String serviceUrl, String metricKey, Double metricValue) {
        this.serviceUrl = serviceUrl;
        this.metricKey = metricKey;
        this.metricValue = metricValue;
    }
}
