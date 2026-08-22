-- Database Indexes Configuration
-- Used Vehicle Trading Platform

-- Indexing foreign keys to accelerate join operations
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_seller_id ON vehicles(seller_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);

-- Search and filter indexes on the marketplace catalog
CREATE INDEX IF NOT EXISTS idx_vehicles_make_model ON vehicles(make, model);
CREATE INDEX IF NOT EXISTS idx_vehicles_price_year ON vehicles(price, year);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);

-- Composite index to support favorites watchlist lookups
CREATE INDEX IF NOT EXISTS idx_favorites_user_vehicle ON favorites(user_id, vehicle_id);

-- Inquiries lookup indexes
CREATE INDEX IF NOT EXISTS idx_vehicle_requests_buyer ON vehicle_requests(buyer_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_requests_vehicle ON vehicle_requests(vehicle_id);

-- Moderation queue status index
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
