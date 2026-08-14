package com.usedvehicle.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public class NotificationResponse {
    private UUID id;
    private String title;
    private String content;
    private Boolean isRead;
    private OffsetDateTime createdAt;

    public NotificationResponse(UUID id, String title, String content, Boolean isRead, OffsetDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public Boolean getIsRead() { return isRead; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
