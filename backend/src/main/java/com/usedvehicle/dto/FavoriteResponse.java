package com.usedvehicle.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class FavoriteResponse {
    private UUID id;
    private UUID vehicleId;
    private String make;
    private String model;
    private Integer year;
    private BigDecimal price;
    private Integer mileage;

    public FavoriteResponse(UUID id, UUID vehicleId, String make, String model, Integer year, BigDecimal price, Integer mileage) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.make = make;
        this.model = model;
        this.year = year;
        this.price = price;
        this.mileage = mileage;
    }

    public UUID getId() { return id; }
    public UUID getVehicleId() { return vehicleId; }
    public String getMake() { return make; }
    public String getModel() { return model; }
    public Integer getYear() { return year; }
    public BigDecimal getPrice() { return price; }
    public Integer getMileage() { return mileage; }
}
