package com.usedvehicle.repository;

import com.usedvehicle.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {
    Optional<Favorite> findByUserIdAndVehicleId(UUID userId, UUID vehicleId);
    List<Favorite> findByUserId(UUID userId);
    boolean existsByUserIdAndVehicleId(UUID userId, UUID vehicleId);
}
