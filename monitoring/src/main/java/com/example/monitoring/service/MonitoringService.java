package com.example.monitoring.service;

import com.example.monitoring.entity.LogEntry;
import com.example.monitoring.entity.Metric;
import com.example.monitoring.repository.LogEntryRepository;
import com.example.monitoring.repository.MetricRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MonitoringService {

    private final MetricRepository metricRepository;
    private final LogEntryRepository logEntryRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${monitor.targets}")
    private List<String> targets;

    @Scheduled(fixedDelayString = "${monitor.scrape.period}")
    public void scrapeMetrics() {
        for (String url : targets) {
            try {
                Map<String, Object> data = restTemplate.getForObject(url + "/metrics", Map.class);
                if (data != null) {
                    data.forEach((key, value) -> {
                        Double metricValue = parseToDouble(value);
                        metricRepository.save(new Metric(url, key, metricValue));
                    });
                }
            } catch (Exception e) {
                metricRepository.save(new Metric(url, "UNREACHABLE", 1.0));
            }
        }
    }

    @Scheduled(fixedDelayString = "${monitor.scrape.period}")
    public void scrapeLogs() {
        for (String url : targets) {
            try {
                List<Map<String, String>> logs = restTemplate.getForObject(url + "/logs", List.class);
                if (logs != null) {
                    logs.forEach(log -> {
                        String ts = log.get("ts");
                        String level = log.get("level");
                        String msg = log.get("msg");
                        logEntryRepository.save(new LogEntry(url, ts, level, msg));
                    });
                }
            } catch (Exception e) {
                logEntryRepository.save(new LogEntry(url,
                    java.time.LocalDateTime.now().toString(),
                    "ERROR",
                    "Failed to fetch logs: " + e.getMessage()));
            }
        }
    }

    private Double parseToDouble(Object value) {
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    public Page<Metric> getAllMetrics(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);

        return metricRepository.findAll(pageable);
    }

    public List<Metric> getMetricsByService(String serviceUrl) {
        return metricRepository.findByServiceUrl(serviceUrl);
    }

    public List<LogEntry> getAllLogs() {
        return logEntryRepository.findAll();
    }

    public List<LogEntry> getLogsByService(String serviceUrl) {
        return logEntryRepository.findByServiceUrl(serviceUrl);
    }
}
