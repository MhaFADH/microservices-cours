package com.example.economy.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class IdentityClient {

    @Value("${identity.service.url}")
    private String identityServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> getUserById(String userId) {
        try {
            return restTemplate.getForObject(
                identityServiceUrl + "/users/" + userId,
                Map.class
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch user from Identity service: " + e.getMessage());
        }
    }
}
