# Database Configuration & Scripts Guide

This directory houses the PostgreSQL scripts required to establish the data schema for the Used Vehicle Trading Platform on **Supabase**.

---

## 1. Database Purpose
The database is structured to persist users (with distinct buyer, seller, and admin roles), vehicle listings (status tracking, detailed specs), watchlists (favorites), direct purchase inquiries, notification queues, and system reporting triggers.

---

## 2. SQL Execution Order
Run the scripts in the following sequence to prevent dependency/foreign key errors:
1.  [`01_schema.sql`](file:///f:/autotrade/backend/database/01_schema.sql) — Initializes custom extensions, builds tables, and enforces constraint validation.
2.  [`02_indexes.sql`](file:///f:/autotrade/backend/database/02_indexes.sql) — Adds performant indices on lookup targets.
3.  [`03_seed_data.sql`](file:///f:/autotrade/backend/database/03_seed_data.sql) — Generates default system roles and development sandbox records.

---

## 3. How to Open Supabase SQL Editor
1.  Log in to the [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select or create your project: **Used Vehicle Trading Platform**.
3.  On the left navigation sidebar, click on the **SQL Editor** tab (represented by a `SQL` icon).
4.  Click **New Query** to create a blank editor page.

---

## 4. How to Execute 01_schema.sql
1.  Open the file [`01_schema.sql`](file:///f:/autotrade/backend/database/01_schema.sql) in your local editor and copy its entire text.
2.  Paste it into the Supabase SQL Editor query window.
3.  Click the **Run** button (or press `Ctrl + Enter` / `Cmd + Enter`).
4.  Confirm that the output reports success (e.g., `Success. No rows returned`).

---

## 5. How to Execute 02_indexes.sql
1.  Create a **New Query** in the Supabase SQL Editor.
2.  Copy the contents of [`02_indexes.sql`](file:///f:/autotrade/backend/database/02_indexes.sql).
3.  Paste the SQL commands into the editor window and click **Run**.

---

## 6. How to Execute 03_seed_data.sql
1.  Create a **New Query** in the Supabase SQL Editor.
2.  Copy the contents of [`03_seed_data.sql`](file:///f:/autotrade/backend/database/03_seed_data.sql).
3.  Paste the script into the editor and click **Run**.

---

## 7. How to Verify Tables
1.  Navigate to the **Table Editor** tab on the left sidebar in Supabase (represented by a grid/table icon).
2.  Ensure you can see the following 8 tables under the `public` schema:
    *   `roles`
    *   `users`
    *   `vehicles`
    *   `vehicle_images`
    *   `favorites`
    *   `vehicle_requests`
    *   `notifications`
    *   `reports`
3.  Click on any table to view the loaded columns, constraints, and seeded records.

---

## 8. Security Notes
*   **Production Environment:** The seeded password hashes in [`03_seed_data.sql`](file:///f:/autotrade/backend/database/03_seed_data.sql) are placeholders and must not be used in live staging or production releases.
*   **Supabase Auth Integration:** The `users` table acts as a profile registry. The `id` primary key is configured as a UUID to seamlessly link with Supabase authentication tables (`auth.users`) once security configurations are enabled in Phase 4.

---

## 9. Environment Variables Required Later
Once the backend integration starts (Phase 3+), you will need the following database variables added to your local configuration:
*   `SPRING_DATASOURCE_URL` — Format: `jdbc:postgresql://db.[your-supabase-reference].supabase.co:5432/postgres`
*   `SPRING_DATASOURCE_USERNAME` — Default: `postgres`
*   `SPRING_DATASOURCE_PASSWORD` — Your project database password set during initialization.
