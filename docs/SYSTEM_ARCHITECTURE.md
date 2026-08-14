# System Architecture

The Used Vehicle Trading Platform employs a modern multi-tiered client-server architecture. The system decouples the user interface (Frontend) from the business logic (Backend) and persists data using a cloud-hosted relational database (Supabase PostgreSQL).

## Architecture Flow Diagram

```
+-------------------------------------------------------------+
|                       ReactJS Frontend                      |
|  (User Interface, State Management, JWT Auth Token Store)   |
+-------------------------------------------------------------+
                              │
                              │ REST HTTP Requests (JSON)
                              ▼
+-------------------------------------------------------------+
|                     Spring Boot Backend                     |
|                                                             |
|  +-------------------------------------------------------+  |
|  | Controller Layer (REST Controllers & Spring Security) |  |
|  +-------------------------------------------------------+  |
|                             │                               |
|                             ▼                               |
|  +-------------------------------------------------------+  |
|  | Service Layer (Business Logic & Authorization Rules)  |  |
|  +-------------------------------------------------------+  |
|                             │                               |
|                             ▼                               |
|  +-------------------------------------------------------+  |
|  | Repository Layer (Spring Data JPA / Hibernate)        |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
                              │
                              │ JDBC / PostgreSQL Connection
                              ▼
+-------------------------------------------------------------+
|                     Supabase PostgreSQL                     |
|       (Relational Database tables + Media Storage)          |
+-------------------------------------------------------------+
```

---

## Detailed Components

### 1. Presentation Layer (ReactJS)
*   **Role:** Single Page Application (SPA) responsible for rendering dashboards and handling UI interactions.
*   **Technologies:** ReactJS, HTML5, Vanilla CSS, React Router (for navigation).
*   **Auth Store:** Stores JWT tokens securely in memory or `localStorage`/`sessionStorage` and attaches them to incoming request headers.

### 2. Communication Bridge (REST API)
*   HTTP REST endpoints using JSON payloads.
*   Protected by a custom Spring Security filter chain verifying cryptographic signatures of JWTs issued during login.

### 3. Application Logic Layer (Java Spring Boot)
*   **Controller Layer:** Maps endpoints (e.g., `/api/vehicles`) to handler methods. Validates incoming payload syntax using `@Valid`.
*   **Service Layer:** Executes core business calculations, manages transactional operations (`@Transactional`), and enforces business rules (e.g., verifying a Seller owns a listing before updating it).
*   **Repository Layer:** Exposes CRUD and query operations using Spring Data JPA. Translates Java entity objects to SQL queries.

### 4. Persistence Layer (Supabase PostgreSQL)
*   **PostgreSQL Engine:** Stores tables, columns, indexes, and constraints.
*   **Supabase Storage:** S3-compatible object storage bucket utilized to host raw vehicle image uploads, referencing public URLs in database tables.
