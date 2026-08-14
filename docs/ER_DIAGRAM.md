# Entity Relationship Diagram

This document contains the Entity Relationship (ER) diagram for the Used Vehicle Trading Platform database. It is written using Mermaid syntax and is fully compatible with GitHub preview.

## Mermaid ER Diagram

```mermaid
erDiagram
    ROLE {
        int id PK
        string name "e.g., BUYER, SELLER, ADMIN"
    }

    USER {
        uuid id PK "Matches Supabase auth.users id"
        string email UK
        string password_hash "For custom authentication if needed"
        string first_name
        string last_name
        string phone
        int role_id FK
        timestamp created_at
        timestamp updated_at
    }

    VEHICLE {
        uuid id PK
        uuid seller_id FK
        string make
        string model
        int year
        decimal price
        int mileage
        string fuel_type "e.g., PETROL, DIESEL, ELECTRIC, HYBRID"
        string transmission "e.g., MANUAL, AUTOMATIC"
        string description
        string status "e.g., DRAFT, PUBLISHED, SOLD, ARCHIVED"
        timestamp created_at
        timestamp updated_at
    }

    VEHICLE_IMAGE {
        uuid id PK
        uuid vehicle_id FK
        string image_url
        boolean is_primary
        timestamp created_at
    }

    FAVORITE {
        uuid id PK
        uuid user_id FK
        uuid vehicle_id FK
        timestamp created_at
    }

    VEHICLE_REQUEST {
        uuid id PK
        uuid buyer_id FK
        uuid vehicle_id FK
        string message
        string contact_email
        string contact_phone
        string status "e.g., PENDING, ACCEPTED, DECLINED"
        timestamp created_at
    }

    NOTIFICATION {
        uuid id PK
        uuid recipient_id FK
        string title
        string content
        boolean is_read
        timestamp created_at
    }

    REPORT {
        uuid id PK
        uuid reporter_id FK
        uuid vehicle_id FK
        string reason "e.g., FRAUD, SPAM, INACCURATE, SOLD"
        string description
        string status "e.g., PENDING, RESOLVED"
        timestamp created_at
    }

    %% Relationships
    ROLE ||--o{ USER : "has"
    USER ||--o{ VEHICLE : "lists"
    USER ||--o{ FAVORITE : "bookmarks"
    USER ||--o{ VEHICLE_REQUEST : "sends"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ REPORT : "submits"

    VEHICLE ||--o{ VEHICLE_IMAGE : "contains"
    VEHICLE ||--o{ FAVORITE : "saved_in"
    VEHICLE ||--o{ VEHICLE_REQUEST : "receives_requests"
    VEHICLE ||--o{ REPORT : "is_reported_by"
```

## Relationship & Cardinality Details

1.  **ROLE to USER (`1:N`)**: A Role can be assigned to multiple users, but a user has exactly one primary role (Buyer, Seller, or Admin).
2.  **USER to VEHICLE (`1:N`)**: A Seller (User) can list multiple vehicles. A vehicle is owned/listed by exactly one Seller.
3.  **VEHICLE to VEHICLE_IMAGE (`1:N`)**: A vehicle can have multiple uploaded images. Each image belongs to exactly one vehicle.
4.  **USER and VEHICLE to FAVORITE (`1:N` & `1:N`)**: M-to-N join table to track bookmarks. A user can favorite many vehicles, and a vehicle can be favorited by many users.
5.  **USER and VEHICLE to VEHICLE_REQUEST (`1:N` & `1:N`)**: Represents interest inquiry. A Buyer (User) can send requests on multiple vehicles, and a vehicle can receive inquiries from multiple buyers.
6.  **USER to NOTIFICATION (`1:N`)**: A user can receive zero or more notifications.
7.  **USER and VEHICLE to REPORT (`1:N` & `1:N`)**: A user can report multiple vehicles. A vehicle can be reported multiple times by different users.
