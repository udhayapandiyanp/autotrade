package com.usedvehicle.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class HealthService {

    public Map<String, String> getHealthStatus() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("message", "Used Vehicle Trading Platform backend is running");
        return health;
    }
}
