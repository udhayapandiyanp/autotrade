package com.usedvehicle.repository;

import com.usedvehicle.entity.Vehicle;
import com.usedvehicle.entity.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID>, JpaSpecificationExecutor<Vehicle> {
    List<Vehicle> findByStatus(VehicleStatus status);
    List<Vehicle> findBySellerIdAndStatusNot(UUID sellerId, VehicleStatus status);
}
