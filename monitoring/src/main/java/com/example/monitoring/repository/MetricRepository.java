package com.example.monitoring.repository;

import com.example.monitoring.entity.Metric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MetricRepository extends JpaRepository<Metric, String> {
    List<Metric> findByServiceUrl(String serviceUrl);
    List<Metric> findByMetricKey(String metricKey);
}
