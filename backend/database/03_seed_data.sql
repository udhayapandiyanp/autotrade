-- Development Seed Data
-- Used Vehicle Trading Platform
-- IMPORTANT: These accounts are for development/testing only and contain mock data.

-- 1. Insert Roles
INSERT INTO roles (id, name) VALUES
(1, 'BUYER'),
(2, 'SELLER'),
(3, 'ADMIN')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence if needed for future insertions
SELECT setval(pg_get_serial_sequence('roles', 'id'), coalesce(max(id),0) + 1, false) FROM roles;

-- 2. Insert Development-Only Users
-- Passwords are set to safe placeholder hashes indicating auth logic is pending Phase 4.
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role_id) VALUES
('11111111-1111-1111-1111-111111111111', 'buyer@dev.local', '$2a$10$placeholderhashbuyerdevelopmentonly', 'Bob', 'Buyer', '+15550100', 1),
('22222222-2222-2222-2222-222222222222', 'seller@dev.local', '$2a$10$placeholderhashsellerdevelopmentonly', 'Sally', 'Seller', '+15550200', 2),
('33333333-3333-3333-3333-333333333333', 'admin@dev.local', '$2a$10$placeholderhashadmindevelopmentonly', 'Alice', 'Admin', '+15550300', 3)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Sample Vehicles (Draft and Published)
INSERT INTO vehicles (id, seller_id, make, model, year, price, mileage, fuel_type, transmission, description, status) VALUES
('a0000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Toyota', 'Camry', 2020, 2150000.00, 32000, 'HYBRID', 'AUTOMATIC', 'Single-owner, fuel-efficient daily driver.', 'PUBLISHED'),
('a0000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Honda', 'Civic', 2018, 1490000.00, 45000, 'PETROL', 'MANUAL', 'Reliable and sport civic. Clean maintenance record.', 'PUBLISHED'),
('a0000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'Tesla', 'Model 3', 2021, 3500000.00, 15000, 'ELECTRIC', 'AUTOMATIC', 'Tesla Model 3 Long Range. Premium interior.', 'DRAFT')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Sample Vehicle Images
INSERT INTO vehicle_images (id, vehicle_id, image_url, is_primary) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'https://supabase.co/storage/v1/object/public/vehicles/camry_front.jpg', TRUE),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'https://supabase.co/storage/v1/object/public/vehicles/camry_back.jpg', FALSE),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'https://supabase.co/storage/v1/object/public/vehicles/civic_side.jpg', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Sample Favorites
INSERT INTO favorites (user_id, vehicle_id) VALUES
('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- 6. Insert Sample Requests / Inquiries
INSERT INTO vehicle_requests (buyer_id, vehicle_id, message, contact_email, contact_phone, status) VALUES
('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000001', 'Hi Sally, I am interested in checking out your Camry this Saturday.', 'buyer@dev.local', '+15550100', 'PENDING')
ON CONFLICT DO NOTHING;
