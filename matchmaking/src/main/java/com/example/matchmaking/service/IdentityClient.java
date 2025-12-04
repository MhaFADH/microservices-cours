package com.example.matchmaking.service;

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

    public void updateUserMmr(String userId, Integer newMmr) {
        try {
            restTemplate.put(
                identityServiceUrl + "/users/" + userId + "/mmr",
                Map.of("mmr", newMmr)
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to update user MMR: " + e.getMessage());
        }
    }
}
