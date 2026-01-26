-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS rent_requests;
DROP TABLE IF EXISTS enquiries;
DROP TABLE IF EXISTS property_panorama_images;
DROP TABLE IF EXISTS property_images;
DROP TABLE IF EXISTS property_amenities;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS builders;
DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(255),
    role VARCHAR(50), -- user, builder, admin
    status VARCHAR(50), -- active, pending_verification
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Builders Table
CREATE TABLE builders (
    id BIGSERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL,
    address VARCHAR(1000),
    gst_number VARCHAR(255),
    verification_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties Table
CREATE TABLE properties (
    id BIGSERIAL PRIMARY KEY,
    builder_id BIGINT NOT NULL REFERENCES builders(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(5000),
    property_type VARCHAR(50), -- RESIDENTIAL, COMMERCIAL
    purpose VARCHAR(50), -- BUY, RENT
    price DECIMAL(19, 2),
    rent_amount DECIMAL(19, 2),
    deposit_amount DECIMAL(19, 2),
    area_sqft INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    possession_year INTEGER,
    construction_status VARCHAR(50), -- UNDER_CONSTRUCTION, READY
    availability_status VARCHAR(50) DEFAULT 'AVAILABLE',
    city VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    google_map_link TEXT,
    brochure_url TEXT,
    virtual_tour_link TEXT,
    legal_document_path TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    panorama_image_path TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property Amenities (ElementCollection)
CREATE TABLE property_amenities (
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    amenity VARCHAR(255)
);

-- Property Images (ElementCollection)
CREATE TABLE property_images (
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT
);

-- Property Panorama Images (ElementCollection - NEW for 360 refactor)
CREATE TABLE property_panorama_images (
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    panorama_image_url TEXT
);

-- Enquiries Table
CREATE TABLE enquiries (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message VARCHAR(1000),
    enquiry_type VARCHAR(50), -- BUY, RENT
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rent Requests Table
CREATE TABLE rent_requests (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    applicant_name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    monthly_rent DECIMAL(19, 2),
    deposit DECIMAL(19, 2),
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Data (Based on your latest schema.sql edits)

-- 1. Insert Builder
INSERT INTO builders (company_name, owner_name, email, phone, address, gst_number, verification_status) VALUES
('DV(Builder)', 'DVBhai', 'visodiyadhyey@gmail.com', '123456789', 'Rajkot', '12ABCDE1234F1Z5', 'VERIFIED');

-- 2. Insert Property (linked to builder_id=1)
INSERT INTO properties (title, description, property_type, purpose, rent_amount, area_sqft, city, area, google_map_link, construction_status, availability_status, builder_id) VALUES
('Luxury 3BHK Apartment', 'Beautiful 3BHK apartment with modern amenities', 'RESIDENTIAL', 'RENT', 25000.00, 1500, 'Mumbai', 'Bandra', 'https://maps.google.com/...', 'READY', 'AVAILABLE', 1);

-- 3. Insert Amenities
INSERT INTO property_amenities (property_id, amenity) VALUES
(1, 'Gym'),
(1, 'Parking'),
(1, 'Security');

-- 4. Insert Images (Placeholder)
INSERT INTO property_images (property_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'),
(1, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'),
(1, 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&w=800&q=80');

-- 5. Insert Enquiry
INSERT INTO enquiries (property_id, name, phone, email, message, enquiry_type) VALUES
(1, 'Raj Patel', '9988776655', 'raj@email.com', 'Interested in this property', 'RENT');

-- 6. Insert Rent Request
INSERT INTO rent_requests (property_id, applicant_name, phone, email, monthly_rent, deposit, status) VALUES
(1, 'Raj Patel', '9988776655', 'raj@email.com', 25000.00, 75000.00, 'PENDING');

-- 7. Insert Sample 360 Image (Valid 2:1 Aspect Ratio)
INSERT INTO property_panorama_images (property_id, panorama_image_url) VALUES
(1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Stonehenge_360_degree_panorama.jpg/1280px-Stonehenge_360_degree_panorama.jpg');
