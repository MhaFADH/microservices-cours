package com.example.identity.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime; 

@Entity
@Data
@Table(name = "users", indexes = {
        @Index(name = "idx_users_created_at", columnList = "created_at"),
        @Index(name = "idx_users_mmr", columnList = "mmr")
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String displayName;

    private Integer mmr = 1000;

    private LocalDateTime createdAt = LocalDateTime.now();
}
