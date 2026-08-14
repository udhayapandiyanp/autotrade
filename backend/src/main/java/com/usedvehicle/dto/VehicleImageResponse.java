package com.usedvehicle.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public class VehicleImageResponse {
    private UUID id;
    private UUID vehicleId;
    private String imageUrl;
    private Boolean isPrimary;
    private OffsetDateTime createdAt;

    public VehicleImageResponse(UUID id, UUID vehicleId, String imageUrl, Boolean isPrimary, OffsetDateTime createdAt) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.imageUrl = imageUrl;
        this.isPrimary = isPrimary;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public UUID getVehicleId() { return vehicleId; }
    public String getImageUrl() { return imageUrl; }
    public Boolean getIsPrimary() { return isPrimary; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
