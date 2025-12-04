package com.example.economy.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class IdentityClient {

    @Value("${identity.service.url}")
    private String identityServiceUrl;

    @Value("${internal.api.key}")
    private String internalApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    private HttpHeaders createInternalHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Internal-API-Key", internalApiKey);
        return headers;
    }

    public Map<String, Object> getUserById(String userId) {
        try {
            HttpEntity<Void> entity = new HttpEntity<>(createInternalHeaders());
            return restTemplate.exchange(
                identityServiceUrl + "/internal/users/" + userId,
                HttpMethod.GET,
                entity,
                Map.class
            ).getBody();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch user from Identity service: " + e.getMessage());
        }
    }
}
