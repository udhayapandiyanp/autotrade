package com.usedvehicle.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class VehicleResponse {
    private UUID id;
    private String make;
    private String model;
    private Integer year;
    private BigDecimal price;
    private Integer mileage;
    private String fuelType;
    private String transmission;
    private String description;
    private String status;
    private UUID sellerId;
    private String sellerName;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public VehicleResponse(UUID id, String make, String model, Integer year, BigDecimal price,
                           Integer mileage, String fuelType, String transmission, String description,
                           String status, UUID sellerId, String sellerName, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.make = make;
        this.model = model;
        this.year = year;
        this.price = price;
        this.mileage = mileage;
        this.fuelType = fuelType;
        this.transmission = transmission;
        this.description = description;
        this.status = status;
        this.sellerId = sellerId;
        this.sellerName = sellerName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() { return id; }
    public String getMake() { return make; }
    public String getModel() { return model; }
    public Integer getYear() { return year; }
    public BigDecimal getPrice() { return price; }
    public Integer getMileage() { return mileage; }
    public String getFuelType() { return fuelType; }
    public String getTransmission() { return transmission; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public UUID getSellerId() { return sellerId; }
    public String getSellerName() { return sellerName; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
