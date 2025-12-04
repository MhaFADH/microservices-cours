package com.example.monitoring.repository;

import com.example.monitoring.entity.LogEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LogEntryRepository extends JpaRepository<LogEntry, String> {
    List<LogEntry> findByServiceUrl(String serviceUrl);
    List<LogEntry> findByLevel(String level);
}
