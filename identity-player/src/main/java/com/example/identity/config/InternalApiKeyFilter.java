package com.example.identity.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class InternalApiKeyFilter extends OncePerRequestFilter {

    @Value("${internal.api.key}")
    private String internalApiKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestPath = request.getRequestURI();

        if (requestPath.startsWith("/internal/")) {
            String apiKey = request.getHeader("X-Internal-API-Key");

            System.out.println("=== Internal API Key Filter ===");
            System.out.println("Request Path: " + requestPath);
            System.out.println("Received API Key: " + (apiKey != null ? "[PRESENT]" : "[MISSING]"));
            System.out.println("Expected API Key: " + (internalApiKey != null ? "[CONFIGURED]" : "[NOT CONFIGURED]"));
            System.out.println("Keys Match: " + (apiKey != null && apiKey.equals(internalApiKey)));

            if (apiKey == null || !apiKey.equals(internalApiKey)) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("{\"error\":\"Invalid or missing internal API key\"}");
                response.setContentType("application/json");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
