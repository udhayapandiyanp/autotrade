# Project Phases

This document structures the development process of the Used Vehicle Trading Platform into 9 distinct phases (Phase 0 to Phase 8).

---

## Phase 0 — Documentation & System Design
*   **Objective:** Define the problem domain, database relationships, API routing, and architectural blueprints prior to writing executable application code.
*   **Major Tasks:**
    *   Draft problem statement and solution architecture overview.
    *   Formulate Entity Relationship (ER) diagrams using Mermaid syntax.
    *   Draft REST API endpoints, schemas, and HTTP methods.
    *   Outline requirements and verify consistency across system designs.
*   **Expected Output:** Complete set of markdown files under `docs/` and root `README.md`.

## Phase 1 — Project Foundation
*   **Objective:** Initialize version control repository structures, Maven configs, build paths, and configure template directories.
*   **Major Tasks:**
    *   Configure `.gitignore` for Java/Spring Boot and Node/React structures.
    *   Initialize ReactJS client project directory.
    *   Initialize Spring Boot Maven project directory with required dependencies (Spring Web, Spring Security, Spring Data JPA, Validation, PostgreSQL Driver).
*   **Expected Output:** Compile-ready backend layout and buildable React app base.

## Phase 2 — Database Setup
*   **Objective:** Provision the Supabase database instance and prepare the database schema with constraints, keys, indexes, and seeded roles.
*   **Major Tasks:**
    *   Create a Supabase project and secure PostgreSQL credentials.
    *   Write and run DLL SQL migrations to define tables: `ROLE`, `USER`, `VEHICLE`, `VEHICLE_IMAGE`, `FAVORITE`, `VEHICLE_REQUEST`, `NOTIFICATION`, and `REPORT`.
    *   Seed default roles (`BUYER`, `SELLER`, `ADMIN`).
*   **Expected Output:** Live database instance populated with verified schemas and test seed data.

## Phase 3 — Spring Boot Backend
*   **Objective:** Build the core database-connected Java service mapping database records to Java entities using Hibernate/JPA.
*   **Major Tasks:**
    *   Configure `application.properties` with database connection strings.
    *   Develop Entity classes (`User`, `Vehicle`, etc.) mapping to the Supabase schemas.
    *   Implement JPA Repository interfaces.
*   **Expected Output:** Compiling persistence layer with unit tests confirming connection and schema mappings.

## Phase 4 — Authentication & Authorization
*   **Objective:** Secure backend endpoints, configure Spring Security filter chains, and implement login/signup JWT mechanics.
*   **Major Tasks:**
    *   Add Spring Security filters to extract and validate incoming JWTs.
    *   Implement `/api/auth/register` (password hashing via BCrypt) and `/api/auth/login`.
    *   Establish Role-based request matches (`hasRole('ADMIN')`, etc.).
*   **Expected Output:** Secure APIs returning tokens and blocking unauthenticated or unauthorized requests.

## Phase 5 — Vehicle Marketplace Features
*   **Objective:** Implement core business rules for listing, searching, favoriting, requesting, and reporting vehicle listings.
*   **Major Tasks:**
    *   Develop REST controllers and services for `/api/vehicles` (CRUD and custom page query filters).
    *   Implement Favorite, Request, Notification, and Report APIs.
*   **Expected Output:** Complete backend API library ready for frontend consumption.

## Phase 6 — React Frontend
*   **Objective:** Develop the single-page user interface (views, inputs, routing, styling).
*   **Major Tasks:**
    *   Design the styling layout using CSS.
    *   Develop core components (Navigation Bar, Vehicle Search Form, Vehicle Card, Dashboards for Buyer, Seller, and Admin).
    *   Implement React state handlers tracking JWT authentication.
*   **Expected Output:** Fully navigable frontend showing mock or dynamic UI elements.

## Phase 7 — Full-Stack Integration
*   **Objective:** Connect the React frontend pages to the live Spring Boot API backend.
*   **Major Tasks:**
    *   Establish Axios or Fetch helper files using interceptors to inject JWT headers automatically.
    *   Replace mock data with API call inputs across catalog, inquiry, and dashboard pages.
*   **Expected Output:** A fully operational, end-to-end user-driven marketplace application.

## Phase 8 — Testing, Security & Finalization
*   **Objective:** Implement automated tests, configure production settings, audit access controls, and prepare final documentation.
*   **Major Tasks:**
    *   Write Spring Boot integration tests verifying controller rules.
    *   Perform manual verification of all user workflows (Buyer, Seller, Admin).
*   **Expected Output:** Production-ready release branch with zero critical lint/test failures.
