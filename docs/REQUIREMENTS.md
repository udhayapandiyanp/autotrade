# System Requirements

This document details the Functional and Non-Functional Requirements of the Used Vehicle Trading Platform.

---

## 1. Functional Requirements

### A. General & Authentication
*   **FR-1.1:** Any user must be able to sign up by providing their email, password, first name, last name, phone number, and registering as either a **Buyer** or **Seller**.
*   **FR-1.2:** The system must validate password complexity and email uniqueness upon registration.
*   **FR-1.3:** The system must verify credentials during sign-in and return a signed JWT token containing user attributes and roles.

### B. Buyer Requirements
*   **FR-2.1:** A Buyer must be able to browse the catalog of published vehicles.
*   **FR-2.2:** A Buyer must be able to filter listings by Make, Model, Year, Mileage (Max), Fuel Type, Transmission, and Price (Min/Max).
*   **FR-2.3:** A Buyer must be able to view details of a single vehicle listing, including description, specs, location, and all uploaded images.
*   **FR-2.4:** A Buyer must be able to toggle a vehicle listing as a "Favorite" to save it to their personal watchlist.
*   **FR-2.5:** A Buyer must be able to submit a "Vehicle Request/Interest" by sending an inquiry form containing a custom message and optional contact details to the seller.
*   **FR-2.6:** A Buyer must be able to report a listing if they believe it is fraudulent, inappropriate, or already sold.

### C. Seller Requirements
*   **FR-3.1:** A Seller must be able to create a new vehicle listing by entering make, model, year, price, mileage, transmission, fuel type, description, and uploading images.
*   **FR-3.2:** A Seller must be able to edit, delete, or change the status of their own listings (e.g., set status to `DRAFT`, `PUBLISHED`, `SOLD`, or `ARCHIVED`).
*   **FR-3.3:** A Seller must have access to a dashboard displaying all incoming vehicle requests/interests submitted by buyers for their listings.
*   **FR-3.4:** A Seller must be notified when a new inquiry is submitted for one of their listings.

### D. Administrator Requirements
*   **FR-4.1:** An Admin must be able to view and manage all registered users (deactivate/activate accounts).
*   **FR-4.2:** An Admin must be able to view all listed vehicles and override listing statuses (e.g., mark a fraudulent listing as `ARCHIVED`).
*   **FR-4.3:** An Admin must be able to view and resolve user reports submitted against listings, choosing to dismiss the report or take down the listing.

---

## 2. Non-Functional Requirements

### A. Security & Compliance
*   **NFR-1.1 (Authentication & JWT):** All protected endpoints must enforce stateless session management authenticated via signed JSON Web Tokens (JWT).
*   **NFR-1.2 (Role-Based Access Control):** Endpoints matching `/api/admin/**` must be restricted to users with the `ADMIN` role. Sellers must not be allowed to edit listings owned by other sellers.
*   **NFR-1.3 (Data Integrity):** Sensitive information (passwords) must be stored securely using BCrypt hashing.
*   **NFR-1.4 (CORS):** Proper Cross-Origin Resource Sharing (CORS) configurations must block requests from unauthorized domains.

### B. Performance & Scalability
*   **NFR-2.1 (Response Times):** Public catalog lookup queries and keyword searches must complete in under 500ms under normal load.
*   **NFR-2.2 (Pagination):** Vehicle search endpoints must support cursor-based or limit-offset pagination to avoid loading thousands of database rows at once.
*   **NFR-2.3 (Image Optimization):** Uploaded vehicle images must be retrieved via content delivery networks (CDNs) or public bucket caches.

### C. Reliability & Usability
*   **NFR-3.1 (Responsive Design):** The React frontend must support standard mobile, tablet, and desktop display resolutions.
*   **NFR-3.2 (Transaction Handling):** Creating a vehicle request and generating notifications must execute inside a single transactional block to prevent orphan states.
