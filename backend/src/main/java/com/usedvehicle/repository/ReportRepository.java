package com.usedvehicle.repository;

import com.usedvehicle.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {
    boolean existsByReporterIdAndVehicleId(UUID reporterId, UUID vehicleId);
}
