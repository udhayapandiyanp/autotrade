package com.usedvehicle.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public class ReportResponse {
    private UUID id;
    private String reporterName;
    private UUID vehicleId;
    private String vehicleName;
    private String reason;
    private String description;
    private String status;
    private OffsetDateTime createdAt;

    public ReportResponse(UUID id, String reporterName, UUID vehicleId, String vehicleName, String reason, String description, String status, OffsetDateTime createdAt) {
        this.id = id;
        this.reporterName = reporterName;
        this.vehicleId = vehicleId;
        this.vehicleName = vehicleName;
        this.reason = reason;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public String getReporterName() { return reporterName; }
    public UUID getVehicleId() { return vehicleId; }
    public String getVehicleName() { return vehicleName; }
    public String getReason() { return reason; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
