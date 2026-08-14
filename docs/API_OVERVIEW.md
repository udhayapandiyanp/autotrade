# API Overview

This document lists the REST API endpoints exposed by the Java Spring Boot backend. All requests are sent in JSON format. Authenticated routes require the header `Authorization: Bearer <token>`.

---

## 1. Authentication Endpoints

### Register User
*   **Method:** `POST`
*   **Path:** `/api/auth/register`
*   **Auth Level:** Public
*   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "Password123!",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "role": "SELLER"
    }
    ```
*   **Response:** `201 Created`
*   *Note: Registration as ADMIN role is blocked server-side.*

### Login User
*   **Method:** `POST`
*   **Path:** `/api/auth/login`
*   **Auth Level:** Public
*   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "Password123!"
    }
    ```
*   **Response:** `200 OK` (with JWT)
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "tokenType": "Bearer",
      "user": {
        "id": "11111111-1111-1111-1111-111111111111",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "phone": "+1234567890",
        "role": "SELLER"
      }
    }
    ```

### Get Current User Profile
*   **Method:** `GET`
*   **Path:** `/api/auth/me`
*   **Auth Level:** Authenticated User
*   **Response:** `200 OK` (UserResponse DTO)

---

## 2. Vehicle Catalog & Management

### Browse / Filter Vehicles
*   **Method:** `GET`
*   **Path:** `/api/vehicles`
*   **Auth Level:** Public
*   **Query Parameters:**
    *   `make` (String) — filter by make keyword (case-insensitive partial match)
    *   `model` (String) — filter by model keyword
    *   `fuelType` (String) — PETROL, DIESEL, ELECTRIC, HYBRID
    *   `transmission` (String) — MANUAL, AUTOMATIC
    *   `minPrice` / `maxPrice` (Decimal) — price bounds
    *   `minYear` / `maxYear` (Integer) — year bounds
    *   `minMileage` / `maxMileage` (Integer) — mileage bounds
    *   `page` (Integer, default: 0) — page number
    *   `size` (Integer, default: 10) — page size
    *   `sortBy` (String, default: createdAt) — price, year, mileage, or createdAt
    *   `sortDir` (String, default: desc) — asc, desc
*   **Response:** `200 OK` (paginated list of published vehicles)

### View Single Vehicle Details
*   **Method:** `GET`
*   **Path:** `/api/vehicles/{id}`
*   **Auth Level:** Public (for PUBLISHED listings; DRAFT/ARCHIVED listings require ownership or ADMIN role)
*   **Response:** `200 OK` (VehicleResponse DTO)

### View Own Listings
*   **Method:** `GET`
*   **Path:** `/api/vehicles/my`
*   **Auth Level:** Authenticated Seller
*   **Response:** `200 OK` (list of seller's listings except ARCHIVED)

### Create Vehicle Listing
*   **Method:** `POST`
*   **Path:** `/api/vehicles`
*   **Auth Level:** Authenticated Seller
*   **Request Body:**
    ```json
    {
      "make": "Toyota",
      "model": "Camry",
      "year": 2021,
      "price": 24500.00,
      "mileage": 15000,
      "fuelType": "HYBRID",
      "transmission": "AUTOMATIC",
      "description": "Like-new hybrid sedan. Single owner."
    }
    ```
*   **Response:** `201 Created` (starts with DRAFT status)

### Update Vehicle Listing
*   **Method:** `PUT`
*   **Path:** `/api/vehicles/{id}`
*   **Auth Level:** Authenticated Seller (must be the owner)
*   **Request Body:** Same structure as Create Vehicle
*   **Response:** `200 OK`

### Publish Vehicle Listing
*   **Method:** `PATCH`
*   **Path:** `/api/vehicles/{id}/publish`
*   **Auth Level:** Authenticated Seller (must be the owner)
*   **Response:** `200 OK` (sets status to PUBLISHED)

### Archive (Soft Delete) Vehicle Listing
*   **Method:** `DELETE`
*   **Path:** `/api/vehicles/{id}`
*   **Auth Level:** Authenticated Seller (must be the owner) or Admin
*   **Response:** `200 OK` (sets status to ARCHIVED)

---

## 3. Vehicle Image Reference Management

### Add Image Reference
*   **Method:** `POST`
*   **Path:** `/api/vehicles/{id}/images`
*   **Auth Level:** Authenticated Seller (must be the owner)
*   **Request Body:**
    ```json
    {
      "imageUrl": "https://supabase.co/storage/v1/object/public/vehicles/image1.jpg",
      "isPrimary": true
    }
    ```
*   **Response:** `201 Created`

### Get Vehicle Image References
*   **Method:** `GET`
*   **Path:** `/api/vehicles/{id}/images`
*   **Auth Level:** Public
*   **Response:** `200 OK` (list of image references)

### Delete Image Reference
*   **Method:** `DELETE`
*   **Path:** `/api/vehicles/{id}/images/{imageId}`
*   **Auth Level:** Authenticated Seller (must be the owner)
*   **Response:** `244 No Content`

---

## 4. Favorites Endpoints (Planned)
*   `POST /api/favorites/{vehicleId}` — Toggle favorite (Buyer)
*   `GET /api/favorites` — List favorites (Buyer)

---

## 5. Vehicle Inquiries & Interest Requests (Planned)
*   `POST /api/requests` — Submit inquiry (Buyer)
*   `GET /api/requests/seller` — Seller's received inquiries (Seller)

---

## 6. Administration & Reporting (Planned)
*   `POST /api/reports` — Report a listing (Buyer/Seller)
*   `GET /api/admin/reports` — List reports (Admin)
*   `PATCH /api/admin/reports/{id}/resolve` — Resolve report (Admin)
