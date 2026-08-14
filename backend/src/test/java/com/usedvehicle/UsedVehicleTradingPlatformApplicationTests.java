package com.usedvehicle;

import com.usedvehicle.dto.*;
import com.usedvehicle.entity.*;
import com.usedvehicle.repository.*;
import com.usedvehicle.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UsedVehicleTradingPlatformApplicationTests {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private VehicleImageRepository vehicleImageRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private VehicleRequestRepository vehicleRequestRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private String buyerToken;
    private String buyerBToken;
    private String sellerAToken;
    private String sellerBToken;
    private String adminToken;

    private User buyer;
    private User buyerB;
    private User sellerA;
    private User sellerB;
    private User admin;

    @BeforeEach
    void setUp() {
        restTemplate.getRestTemplate().setRequestFactory(new org.springframework.http.client.JdkClientHttpRequestFactory());

        reportRepository.deleteAll();
        notificationRepository.deleteAll();
        vehicleRequestRepository.deleteAll();
        favoriteRepository.deleteAll();
        vehicleImageRepository.deleteAll();
        vehicleRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();

        // Seed roles
        Role buyerRole = roleRepository.save(new Role(1, "BUYER"));
        Role sellerRole = roleRepository.save(new Role(2, "SELLER"));
        Role adminRole = roleRepository.save(new Role(3, "ADMIN"));

        // Setup Buyer User
        buyer = new User();
        buyer.setEmail("buyer@test.com");
        buyer.setPasswordHash("hash");
        buyer.setFirstName("Bob");
        buyer.setLastName("Buyer");
        buyer.setRole(buyerRole);
        userRepository.save(buyer);
        buyerToken = jwtUtils.generateToken(buyer.getEmail(), "BUYER");

        // Setup Buyer B User
        buyerB = new User();
        buyerB.setEmail("buyerB@test.com");
        buyerB.setPasswordHash("hash");
        buyerB.setFirstName("Bill");
        buyerB.setLastName("BuyerB");
        buyerB.setRole(buyerRole);
        userRepository.save(buyerB);
        buyerBToken = jwtUtils.generateToken(buyerB.getEmail(), "BUYER");

        // Setup Seller A User
        sellerA = new User();
        sellerA.setEmail("sellerA@test.com");
        sellerA.setPasswordHash("hash");
        sellerA.setFirstName("Sally");
        sellerA.setLastName("SellerA");
        sellerA.setRole(sellerRole);
        userRepository.save(sellerA);
        sellerAToken = jwtUtils.generateToken(sellerA.getEmail(), "SELLER");

        // Setup Seller B User
        sellerB = new User();
        sellerB.setEmail("sellerB@test.com");
        sellerB.setPasswordHash("hash");
        sellerB.setFirstName("Sam");
        sellerB.setLastName("SellerB");
        sellerB.setRole(sellerRole);
        userRepository.save(sellerB);
        sellerBToken = jwtUtils.generateToken(sellerB.getEmail(), "SELLER");

        // Setup Admin User
        admin = new User();
        admin.setEmail("admin@test.com");
        admin.setPasswordHash("hash");
        admin.setFirstName("Alice");
        admin.setLastName("Admin");
        admin.setRole(adminRole);
        userRepository.save(admin);
        adminToken = jwtUtils.generateToken(admin.getEmail(), "ADMIN");
    }

    @Test
    void contextLoads() {}

    @Test
    void healthCheckReturnsUp() {
        ResponseEntity<Map> response = restTemplate.getForEntity("/api/health", Map.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo("UP");
    }

    // ==========================================
    // PHASE 4 & 5 SECURITY & VEHICLE TESTS
    // ==========================================

    @Test
    void sellerCreatesVehicleSucceeds() {
        VehicleCreateRequest request = createMockVehicleRequest("Toyota", "Camry", 2020, 20000);
        HttpHeaders headers = createAuthHeaders(sellerAToken);
        HttpEntity<VehicleCreateRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<VehicleResponse> response = restTemplate.postForEntity("/api/vehicles", entity, VehicleResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMake()).isEqualTo("Toyota");
        assertThat(response.getBody().getStatus()).isEqualTo("DRAFT");
    }

    @Test
    void buyerCannotCreateVehicle() {
        VehicleCreateRequest request = createMockVehicleRequest("Toyota", "Camry", 2020, 20000);
        HttpHeaders headers = createAuthHeaders(buyerToken);
        HttpEntity<VehicleCreateRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity("/api/vehicles", entity, Map.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void unauthenticatedUserCannotCreateVehicle() {
        VehicleCreateRequest request = createMockVehicleRequest("Toyota", "Camry", 2020, 20000);
        HttpEntity<VehicleCreateRequest> entity = new HttpEntity<>(request);

        ResponseEntity<Map> response = restTemplate.postForEntity("/api/vehicles", entity, Map.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void sellerUpdatesOwnVehicle() {
        Vehicle vehicle = saveMockVehicle(sellerA, "Toyota", "Camry", 2020, 20000, VehicleStatus.DRAFT);

        VehicleUpdateRequest request = new VehicleUpdateRequest();
        request.setMake("Toyota");
        request.setModel("Corolla");
        request.setYear(2021);
        request.setPrice(new BigDecimal("19000"));
        request.setMileage(10000);
        request.setFuelType("HYBRID");
        request.setTransmission("AUTOMATIC");

        HttpHeaders headers = createAuthHeaders(sellerAToken);
        HttpEntity<VehicleUpdateRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<VehicleResponse> response = restTemplate.exchange(
                "/api/vehicles/" + vehicle.getId(), HttpMethod.PUT, entity, VehicleResponse.class
        );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getModel()).isEqualTo("Corolla");
    }

    @Test
    void sellerCannotUpdateAnotherSellersVehicle() {
        Vehicle vehicle = saveMockVehicle(sellerB, "Honda", "Civic", 2019, 18000, VehicleStatus.DRAFT);

        VehicleUpdateRequest request = new VehicleUpdateRequest();
        request.setMake("Honda");
        request.setModel("Accord");
        request.setYear(2020);
        request.setPrice(new BigDecimal("22000"));
        request.setMileage(15000);
        request.setFuelType("PETROL");
        request.setTransmission("AUTOMATIC");

        HttpHeaders headers = createAuthHeaders(sellerAToken);
        HttpEntity<VehicleUpdateRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                "/api/vehicles/" + vehicle.getId(), HttpMethod.PUT, entity, Map.class
        );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void sellerPublishesOwnVehicle() {
        Vehicle vehicle = saveMockVehicle(sellerA, "Toyota", "Camry", 2020, 20000, VehicleStatus.DRAFT);

        HttpHeaders headers = createAuthHeaders(sellerAToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<VehicleResponse> response = restTemplate.exchange(
                "/api/vehicles/" + vehicle.getId() + "/publish", HttpMethod.PATCH, entity, VehicleResponse.class
        );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getStatus()).isEqualTo("PUBLISHED");
    }

    @Test
    void sellerCannotPublishAnotherSellersVehicle() {
        Vehicle vehicle = saveMockVehicle(sellerB, "Honda", "Civic", 2019, 18000, VehicleStatus.DRAFT);

        HttpHeaders headers = createAuthHeaders(sellerAToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                "/api/vehicles/" + vehicle.getId() + "/publish", HttpMethod.PATCH, entity, Map.class
        );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void sellerArchivesOwnVehicle() {
        Vehicle vehicle = saveMockVehicle(sellerA, "Toyota", "Camry", 2020, 20000, VehicleStatus.PUBLISHED);

        HttpHeaders headers = createAuthHeaders(sellerAToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<VehicleResponse> response = restTemplate.exchange(
                "/api/vehicles/" + vehicle.getId(), HttpMethod.DELETE, entity, VehicleResponse.class
        );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getStatus()).isEqualTo("ARCHIVED");
    }

    @Test
    void publicUserCanViewPublishedVehicles() {
        saveMockVehicle(sellerA, "Toyota", "Camry", 2020, 20000, VehicleStatus.PUBLISHED);

        ResponseEntity<Map> response = restTemplate.getForEntity("/api/vehicles", Map.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
    }

    @Test
    void publicUserCannotViewDraftVehicle() {
        Vehicle vehicle = saveMockVehicle(sellerA, "Toyota", "Camry", 2020, 20000, VehicleStatus.DRAFT);

        ResponseEntity<Map> response = restTemplate.getForEntity("/api/vehicles/" + vehicle.getId(), Map.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void publicUserCannotViewArchivedVehicle() {
        Vehicle vehicle = saveMockVehicle(sellerA, "Toyota", "Camry", 2020, 20000, VehicleStatus.ARCHIVED);

        ResponseEntity<Map> response = restTemplate.getForEntity("/api/vehicles/" + vehicle.getId(), Map.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void searchByMakeWorks() {
        saveMockVehicle(sellerA, "Toyota", "Camry", 2020, 20000, VehicleStatus.PUBLISHED);
        saveMockVehicle(sellerA, "Honda", "Civic", 2019, 18000, VehicleStatus.PUBLISHED);

        ResponseEntity<Map> response = restTemplate.getForEntity("/api/vehicles?make=Toyota", Map.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        java.util.List content = (java.util.List) response.getBody().get("content");
        assertThat(content.size()).isEqualTo(1);
    }

    // ==========================================
    // PHASE 7 FAVORITES, REQUESTS & REPORTS
    // ==========================================

    @Test
    void addFavoriteSucceeds() {
        Vehicle vehicle = saveMockVehicle(sellerA, "Toyota", "Camry", 2020, 20000, VehicleStatus.PUBLISHED);

        HttpHeaders headers = createAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<FavoriteResponse> response = restTemplate.postForEntity(
                "/api/favorites/" + vehicle.getId(), entity, FavoriteResponse.class
        );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getVehicleId()).isEqualTo(vehicle.getId());
    }

    @Test
    void addDuplicateFavoriteRejected() {
        Vehicle vehicle = saveMockVehicle(sellerA, "Toyota", "Camry", 2020, 20000, VehicleStatus.PUBLISHED);

        Favorite fav = new Favorite();
        fav.setUser(buyer);
        fav.setVehicle(vehicle);
        favoriteRepository.save(fav);

        HttpHeaders headers = createAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "/api/favorites/" + vehicle.getId(), entity, Map.class
        );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void removeFavoriteSucceeds() {
        Vehicle vehicle = saveMockVehicle(sellerA, "Toyota", "Camry", 2020, 20000, VehicleStatus.PUBLISHED);

        Favorite fav = new Favorite();
        fav.setUser(buyer);
        fav.setVehicle(vehicle);
        favoriteRepository.save(fav);

        HttpHeaders headers = createAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Void> response = restTemplate.exchange(
                "/api/favorites/" + vehicle.getId(), HttpMethod.DELETE, entity, Void.class
        );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    @Test
    void sellerCannotAddFavorite() {
        Vehicle vehicle = saveMockVehicle(sellerB, "Honda", "Civic", 2019, 18000, VehicleStatus.PUBLISHED);

        HttpHeaders headers = createAuthHeaders(sellerAToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "/api/favorites/" + vehicle.getId(), entity, Map.class
        );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void buyerCreatesRequestSucceeds() {
        Vehicle vehicle = saveMockVehicle(sellerA, "Toyota", "Camry", 2020, 20000, VehicleStatus.PUBLISHED);

        VehicleRequestRequest request = new VehicleRequestRequest();
        request.setVehicleId(vehicle.getId());
        request.setMessage("I'm interested in buying this car!");
        request.setContactEmail("buyer@test.com");

        HttpHeaders headers = createAuthHeaders(buyerToken);
        HttpEntity<VehicleRequestRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<VehicleRequestResponse> response = restTemplate.postForEntity(
                "/api/requests", entity, VehicleRequestResponse.class
        );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getMessage()).isEqualTo("I'm interested in buying this car!");
    }

    @Test
    void duplicatePendingRequestRejected() {
        Vehicle vehicle = saveMockVehicle(sellerA, "Toyota", "Camry", 2020, 20000, VehicleStatus.PUBLISHED);

        VehicleRequest req = new VehicleRequest();
        req.setBuyer(buyer);
        req.setVehicle(vehicle);
        req.setMessage("First pending request");
        req.setContactEmail("buyer@test.com");
        req.setStatus(RequestStatus.PENDING);
        vehicleRequestRepository.save(req);

        VehicleRequestRequest request = new VehicleRequestRequest();
        request.setVehicleId(vehicle.getId());
        request.setMessage("Second pending request");
        request.setContactEmail("buyer@test.com");

        HttpHeaders headers = createAuthHeaders(buyerToken);
        HttpEntity<VehicleRequestRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "/api/requests", entity, Map.class
        );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void sellerSeesRequestsForOwnVehicles() {
        Vehicle vehicle = saveMockVehicle(sellerA, "Toyota", "Camry", 2020, 20000, VehicleStatus.PUBLISHED);

        VehicleRequest req = new VehicleRequest();
        req.setBuyer(buyer);
        req.setVehicle(vehicle);
        req.setMessage("First pending request");
        req.setContactEmail("buyer@test.com");
        req.setStatus(RequestStatus.PENDING);
        vehicleRequestRepository.save(req);

        HttpHeaders headersA = createAuthHeaders(sellerAToken);
        HttpEntity<Void> entityA = new HttpEntity<>(headersA);
        ResponseEntity<java.util.List> responseA = restTemplate.exchange(
                "/api/requests/seller", HttpMethod.GET, entityA, java.util.List.class
        );
        assertThat(responseA.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseA.getBody().size()).isEqualTo(1);
    }

    @Test
    void sellerAcceptsRequestSucceeds() {
        Vehicle vehicle = saveMockVehicle(sellerA, "Toyota", "Camry", 2020, 20000, VehicleStatus.PUBLISHED);

        VehicleRequest req = new VehicleRequest();
        req.setBuyer(buyer);
        req.setVehicle(vehicle);
        req.setMessage("Pending inquiry");
        req.setContactEmail("buyer@test.com");
        req.setStatus(RequestStatus.PENDING);
        VehicleRequest savedReq = vehicleRequestRepository.save(req);

        HttpHeaders headers = createAuthHeaders(sellerAToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<VehicleRequestResponse> response = restTemplate.exchange(
                "/api/requests/" + savedReq.getId() + "/status?status=ACCEPTED",
                HttpMethod.PATCH, entity, VehicleRequestResponse.class
        );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getStatus()).isEqualTo("ACCEPTED");
    }

    @Test
    void notificationReadOperationsWork() {
        Notification n1 = new Notification();
        n1.setRecipient(buyer);
        n1.setTitle("Title 1");
        n1.setContent("Content 1");
        n1.setIsRead(false);
        notificationRepository.save(n1);

        HttpHeaders headers = createAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Long> countRes = restTemplate.exchange(
                "/api/notifications/unread-count", HttpMethod.GET, entity, Long.class
        );
        assertThat(countRes.getBody()).isEqualTo(1L);

        ResponseEntity<Void> readAllRes = restTemplate.exchange(
                "/api/notifications/read-all", HttpMethod.PATCH, entity, Void.class
        );
        assertThat(readAllRes.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    @Test
    void reportsOperationsWork() {
        Vehicle vehicle = saveMockVehicle(sellerA, "Toyota", "Camry", 2020, 20000, VehicleStatus.PUBLISHED);

        ReportRequest request = new ReportRequest();
        request.setReason("FRAUD");
        request.setDescription("Suspicious seller listing.");

        HttpHeaders headersBuyer = createAuthHeaders(buyerToken);
        HttpEntity<ReportRequest> entityBuyer = new HttpEntity<>(request, headersBuyer);

        ResponseEntity<ReportResponse> reportRes = restTemplate.postForEntity(
                "/api/reports/" + vehicle.getId(), entityBuyer, ReportResponse.class
        );
        assertThat(reportRes.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        HttpHeaders headersAdmin = createAuthHeaders(adminToken);
        HttpEntity<Void> entityAdmin = new HttpEntity<>(headersAdmin);
        ResponseEntity<ReportResponse> resolveRes = restTemplate.exchange(
                "/api/reports/admin/" + reportRes.getBody().getId() + "/resolve",
                HttpMethod.PATCH, entityAdmin, ReportResponse.class
        );
        assertThat(resolveRes.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resolveRes.getBody().getStatus()).isEqualTo("RESOLVED");
    }

    // Helpers
    private HttpHeaders createAuthHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        return headers;
    }

    private VehicleCreateRequest createMockVehicleRequest(String make, String model, int year, double price) {
        VehicleCreateRequest request = new VehicleCreateRequest();
        request.setMake(make);
        request.setModel(model);
        request.setYear(year);
        request.setPrice(BigDecimal.valueOf(price));
        request.setMileage(15000);
        request.setFuelType("PETROL");
        request.setTransmission("AUTOMATIC");
        request.setDescription("Good condition.");
        return request;
    }

    private Vehicle saveMockVehicle(User seller, String make, String model, int year, double price, VehicleStatus status) {
        Vehicle vehicle = new Vehicle();
        vehicle.setSeller(seller);
        vehicle.setMake(make);
        vehicle.setModel(model);
        vehicle.setYear(year);
        vehicle.setPrice(BigDecimal.valueOf(price));
        vehicle.setMileage(15000);
        vehicle.setFuelType(FuelType.PETROL);
        vehicle.setTransmission(Transmission.AUTOMATIC);
        vehicle.setStatus(status);
        return vehicleRepository.save(vehicle);
    }
}
