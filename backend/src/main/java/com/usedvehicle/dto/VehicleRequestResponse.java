package com.usedvehicle.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public class VehicleRequestResponse {
    private UUID id;
    private UUID vehicleId;
    private String vehicleName;
    private String buyerName;
    private String message;
    private String status;
    private OffsetDateTime createdAt;

    public VehicleRequestResponse(UUID id, UUID vehicleId, String vehicleName, String buyerName, String message, String status, OffsetDateTime createdAt) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.vehicleName = vehicleName;
        this.buyerName = buyerName;
        this.message = message;
        this.status = status;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public UUID getVehicleId() { return vehicleId; }
    public String getVehicleName() { return vehicleName; }
    public String getBuyerName() { return buyerName; }
    public String getMessage() { return message; }
    public String getStatus() { return status; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
