import { neon, neonConfig } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

// Configure Neon to allow browser usage without warnings (for prototyping)
// neonConfig.fetchConnectionCache = true; (Deprecated in recent versions)

// Initialize NeonDB connection
let sql;
try {
  const databaseUrl = import.meta.env?.VITE_DATABASE_URL || process.env?.VITE_DATABASE_URL;

  if (databaseUrl) {
    const cleanUrl = databaseUrl.replace(/^['"]|['"]$/g, '');
    sql = neon(cleanUrl);
    console.log('Database connected to NeonDB successfully');
  } else {
    throw new Error('VITE_DATABASE_URL not found in environment variables');
  }
} catch (error) {
  console.error('Failed to initialize database connection:', error);
  throw error;
}

export default sql;

// Initialize database tables
export async function initializeDatabase() {
  try {
    console.log('Checking database schema...');

    // Users table

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        phone VARCHAR(15),
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'builder', 'admin')),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending_verification', 'banned')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Properties table
    await sql`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        builder_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        property_type VARCHAR(50) NOT NULL,
        purpose VARCHAR(20) NOT NULL CHECK (purpose IN ('Buy', 'Rent')),
        price VARCHAR(50),
        rent_amount VARCHAR(50),
        area_sqft VARCHAR(50),
        city VARCHAR(100),
        area VARCHAR(100),
        possession_year VARCHAR(50),
        construction_status VARCHAR(50),
        description TEXT,
        bedrooms INTEGER,
        bathrooms INTEGER,
        amenities TEXT[],
        images TEXT[],
        brochure_url TEXT,
        google_map_link TEXT,
        virtual_tour_link TEXT,
        availability_status VARCHAR(20) DEFAULT 'AVAILABLE',
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'blocked')),
        legal_document_path TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
        panorama_image_path TEXT,
        panorama_images TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Migration for existing tables
    try {
      await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS legal_document_path TEXT`;
      await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE`;
      await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS panorama_image_path TEXT`;
      await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS panorama_images TEXT[]`;
    } catch (e) {
      console.log('Migration columns likely exist or error ignored:', e);
    }

    // Enquiries table
    await sql`
      CREATE TABLE IF NOT EXISTS enquiries (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        builder_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        full_name VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(15),
        message TEXT,
        enquiry_type VARCHAR(20) DEFAULT 'buy' CHECK (enquiry_type IN ('buy', 'rent')),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Rent requests table
    await sql`
      CREATE TABLE IF NOT EXISTS rent_requests (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        builder_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        move_in_date DATE,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'completed')),
        rent_amount VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Complaints table
    await sql`
      CREATE TABLE IF NOT EXISTS complaints (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        issue TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Wishlist table
    await sql`
      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, property_id)
      )
    `;

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Helper function to hash passwords
export async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Helper function to compare passwords
export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}