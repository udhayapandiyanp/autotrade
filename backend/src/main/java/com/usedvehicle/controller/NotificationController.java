package com.usedvehicle.controller;

import com.usedvehicle.dto.NotificationResponse;
import com.usedvehicle.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(Authentication auth) {
        String email = (String) auth.getPrincipal();
        List<NotificationResponse> response = notificationService.getNotifications(email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(Authentication auth) {
        String email = (String) auth.getPrincipal();
        long count = notificationService.getUnreadCount(email);
        return ResponseEntity.ok(count);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable UUID id, Authentication auth) {
        String email = (String) auth.getPrincipal();
        NotificationResponse response = notificationService.markAsRead(id, email);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication auth) {
        String email = (String) auth.getPrincipal();
        notificationService.markAllAsRead(email);
        return ResponseEntity.noContent().build();
    }
}
