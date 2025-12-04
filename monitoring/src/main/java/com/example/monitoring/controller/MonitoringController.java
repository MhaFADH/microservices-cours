package com.example.monitoring.controller;

import com.example.monitoring.entity.LogEntry;
import com.example.monitoring.entity.Metric;
import com.example.monitoring.service.MonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/monitoring")
@RequiredArgsConstructor
public class MonitoringController {

    private final MonitoringService monitoringService;

    @GetMapping("/metrics")
    public ResponseEntity<List<Metric>> getAllCollectedMetrics() {
        return ResponseEntity.ok(monitoringService.getAllMetrics());
    }

    @GetMapping("/metrics/{serviceUrl}")
    public ResponseEntity<List<Metric>> getMetricsByService(@PathVariable String serviceUrl) {
        String decodedUrl = java.net.URLDecoder.decode(serviceUrl, java.nio.charset.StandardCharsets.UTF_8);
        return ResponseEntity.ok(monitoringService.getMetricsByService(decodedUrl));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<LogEntry>> getAllCollectedLogs() {
        return ResponseEntity.ok(monitoringService.getAllLogs());
    }

    @GetMapping("/logs/{serviceUrl}")
    public ResponseEntity<List<LogEntry>> getLogsByService(@PathVariable String serviceUrl) {
        String decodedUrl = java.net.URLDecoder.decode(serviceUrl, java.nio.charset.StandardCharsets.UTF_8);
        return ResponseEntity.ok(monitoringService.getLogsByService(decodedUrl));
    }
}
