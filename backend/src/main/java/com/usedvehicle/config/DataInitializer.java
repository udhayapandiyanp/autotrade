package com.usedvehicle.config;

import com.usedvehicle.entity.*;
import com.usedvehicle.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final VehicleImageRepository vehicleImageRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           VehicleRepository vehicleRepository,
                           VehicleImageRepository vehicleImageRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.vehicleImageRepository = vehicleImageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        Role buyerRole = roleRepository.findByName("BUYER").orElseGet(() -> {
            Role r = new Role();
            r.setName("BUYER");
            return roleRepository.save(r);
        });

        Role sellerRole = roleRepository.findByName("SELLER").orElseGet(() -> {
            Role r = new Role();
            r.setName("SELLER");
            return roleRepository.save(r);
        });

        Role adminRole = roleRepository.findByName("ADMIN").orElseGet(() -> {
            Role r = new Role();
            r.setName("ADMIN");
            return roleRepository.save(r);
        });

        // Only activate development accounts if their password hash is an unusable placeholder
        userRepository.findByEmail("admin@dev.local").ifPresent(adminUser -> {
            if (adminUser.getPasswordHash() != null && adminUser.getPasswordHash().contains("placeholder")) {
                adminUser.setPasswordHash(passwordEncoder.encode("password123"));
                userRepository.save(adminUser);
            }
        });
        userRepository.findByEmail("buyer@dev.local").ifPresent(buyerUser -> {
            if (buyerUser.getPasswordHash() != null && buyerUser.getPasswordHash().contains("placeholder")) {
                buyerUser.setPasswordHash(passwordEncoder.encode("password123"));
                userRepository.save(buyerUser);
            }
        });
        userRepository.findByEmail("seller@dev.local").ifPresent(sellerUser -> {
            if (sellerUser.getPasswordHash() != null && sellerUser.getPasswordHash().contains("placeholder")) {
                sellerUser.setPasswordHash(passwordEncoder.encode("password123"));
                userRepository.save(sellerUser);
            }
        });

        if (userRepository.count() == 0) {
            User seller = new User();
            seller.setEmail("seller@dev.local");
            seller.setPasswordHash(passwordEncoder.encode("password123"));
            seller.setFirstName("Sally");
            seller.setLastName("Seller");
            seller.setPhone("+15550200");
            seller.setRole(sellerRole);
            User savedSeller = userRepository.save(seller);

            User buyer = new User();
            buyer.setEmail("buyer@dev.local");
            buyer.setPasswordHash(passwordEncoder.encode("password123"));
            buyer.setFirstName("Bob");
            buyer.setLastName("Buyer");
            buyer.setPhone("+15550100");
            buyer.setRole(buyerRole);
            userRepository.save(buyer);

            User admin = new User();
            admin.setEmail("admin@dev.local");
            admin.setPasswordHash(passwordEncoder.encode("password123"));
            admin.setFirstName("Alice");
            admin.setLastName("Admin");
            admin.setPhone("+15550300");
            admin.setRole(adminRole);
            userRepository.save(admin);

            // Sample Vehicles
            Vehicle v1 = new Vehicle();
            v1.setSeller(savedSeller);
            v1.setMake("Toyota");
            v1.setModel("Camry");
            v1.setYear(2020);
            v1.setPrice(new BigDecimal("21500.00"));
            v1.setMileage(32000);
            v1.setFuelType(FuelType.HYBRID);
            v1.setTransmission(Transmission.AUTOMATIC);
            v1.setDescription("Single-owner, fuel-efficient daily driver with full service history.");
            v1.setStatus(VehicleStatus.PUBLISHED);
            Vehicle savedV1 = vehicleRepository.save(v1);

            VehicleImage img1 = new VehicleImage();
            img1.setVehicle(savedV1);
            img1.setImageUrl("https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop");
            img1.setIsPrimary(true);
            vehicleImageRepository.save(img1);

            Vehicle v2 = new Vehicle();
            v2.setSeller(savedSeller);
            v2.setMake("Honda");
            v2.setModel("Civic");
            v2.setYear(2018);
            v2.setPrice(new BigDecimal("17900.00"));
            v2.setMileage(45000);
            v2.setFuelType(FuelType.PETROL);
            v2.setTransmission(Transmission.MANUAL);
            v2.setDescription("Reliable and sporty civic. Clean maintenance record.");
            v2.setStatus(VehicleStatus.PUBLISHED);
            Vehicle savedV2 = vehicleRepository.save(v2);

            VehicleImage img2 = new VehicleImage();
            img2.setVehicle(savedV2);
            img2.setImageUrl("https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&auto=format&fit=crop");
            img2.setIsPrimary(true);
            vehicleImageRepository.save(img2);

            Vehicle v3 = new Vehicle();
            v3.setSeller(savedSeller);
            v3.setMake("Tesla");
            v3.setModel("Model 3");
            v3.setYear(2021);
            v3.setPrice(new BigDecimal("35000.00"));
            v3.setMileage(15000);
            v3.setFuelType(FuelType.ELECTRIC);
            v3.setTransmission(Transmission.AUTOMATIC);
            v3.setDescription("Tesla Model 3 Long Range. Premium interior, autopilot enabled.");
            v3.setStatus(VehicleStatus.DRAFT);
            Vehicle savedV3 = vehicleRepository.save(v3);

            VehicleImage img3 = new VehicleImage();
            img3.setVehicle(savedV3);
            img3.setImageUrl("https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop");
            img3.setIsPrimary(true);
            vehicleImageRepository.save(img3);
        }
    }
}
