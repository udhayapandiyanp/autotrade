package com.usedvehicle.controller;

import com.usedvehicle.dto.FavoriteResponse;
import com.usedvehicle.service.FavoriteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/favorites")
@PreAuthorize("hasRole('BUYER')")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping("/{vehicleId}")
    public ResponseEntity<FavoriteResponse> addFavorite(@PathVariable UUID vehicleId, Authentication auth) {
        String email = (String) auth.getPrincipal();
        FavoriteResponse response = favoriteService.addFavorite(vehicleId, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable UUID vehicleId, Authentication auth) {
        String email = (String) auth.getPrincipal();
        favoriteService.removeFavorite(vehicleId, email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<FavoriteResponse>> getFavorites(Authentication auth) {
        String email = (String) auth.getPrincipal();
        List<FavoriteResponse> response = favoriteService.getFavorites(email);
        return ResponseEntity.ok(response);
    }
}
