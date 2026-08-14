package com.usedvehicle.repository;

import com.usedvehicle.entity.RequestStatus;
import com.usedvehicle.entity.VehicleRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VehicleRequestRepository extends JpaRepository<VehicleRequest, UUID> {
    List<VehicleRequest> findByBuyerId(UUID buyerId);
    List<VehicleRequest> findByVehicleSellerId(UUID sellerId);
    boolean existsByBuyerIdAndVehicleIdAndStatus(UUID buyerId, UUID vehicleId, RequestStatus status);
}
