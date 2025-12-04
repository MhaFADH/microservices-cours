package com.example.identity.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;

@Service
public class LogService {
    private final Queue<Map<String, String>> logs = new ConcurrentLinkedQueue<>();
    private static final int MAX_LOGS = 100;

    public void log(String level, String message) {
        Map<String, String> logEntry = new HashMap<>();
        logEntry.put("ts", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        logEntry.put("level", level);
        logEntry.put("msg", message);

        logs.offer(logEntry);

        if (logs.size() > MAX_LOGS) {
            logs.poll();
        }
    }

    public List<Map<String, String>> getLogs() {
        return new ArrayList<>(logs);
    }
}
