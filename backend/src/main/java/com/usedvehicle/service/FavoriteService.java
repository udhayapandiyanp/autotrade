package com.usedvehicle.service;

import com.usedvehicle.dto.FavoriteResponse;
import com.usedvehicle.entity.Favorite;
import com.usedvehicle.entity.User;
import com.usedvehicle.entity.Vehicle;
import com.usedvehicle.repository.FavoriteRepository;
import com.usedvehicle.repository.UserRepository;
import com.usedvehicle.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, UserRepository userRepository, VehicleRepository vehicleRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional
    public FavoriteResponse addFavorite(UUID vehicleId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (!"BUYER".equals(user.getRole().getName())) {
            throw new IllegalArgumentException("Only buyers can manage watchlists.");
        }

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found."));

        if (favoriteRepository.existsByUserIdAndVehicleId(user.getId(), vehicleId)) {
            throw new IllegalArgumentException("Vehicle is already in your watchlist.");
        }

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setVehicle(vehicle);

        Favorite saved = favoriteRepository.save(favorite);
        return convertToResponse(saved);
    }

    @Transactional
    public void removeFavorite(UUID vehicleId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        Favorite favorite = favoriteRepository.findByUserIdAndVehicleId(user.getId(), vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Favorite reference not found."));

        favoriteRepository.delete(favorite);
    }

    @Transactional(readOnly = true)
    public List<FavoriteResponse> getFavorites(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        List<Favorite> list = favoriteRepository.findByUserId(user.getId());
        return list.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    private FavoriteResponse convertToResponse(Favorite fav) {
        return new FavoriteResponse(
                fav.getId(),
                fav.getVehicle().getId(),
                fav.getVehicle().getMake(),
                fav.getVehicle().getModel(),
                fav.getVehicle().getYear(),
                fav.getVehicle().getPrice(),
                fav.getVehicle().getMileage()
        );
    }
}
