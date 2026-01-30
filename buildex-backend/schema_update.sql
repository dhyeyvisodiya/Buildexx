-- ==========================================
-- SCHEMA UPDATE SCRIPT FOR BUILDEX REFACTOR
-- ==========================================
-- This script consolidates the 'builders' table into the 'users' table.
-- RUN THIS SCRIPT IN YOUR NEON DB CONSOLE OR PGADMIN.

-- 1. Add Builder-specific columns to 'users' table
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS gst_number VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address VARCHAR(1000);
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_status VARCHAR(255) DEFAULT 'PENDING';

-- 2. Update 'properties' table
DO $$ 
BEGIN
    -- Drop old foreign key if exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'properties_builder_id_fkey') THEN
        ALTER TABLE properties DROP CONSTRAINT properties_builder_id_fkey;
    END IF;

    -- CRITICAL FIX: Remove properties that reference non-existent users (orphaned from old builders table)
    DELETE FROM properties WHERE builder_id NOT IN (SELECT id FROM users);

    -- Rename column validation (it should already be builder_id)
    -- If you had a separate column, rename it here. We assume it is 'builder_id'.

    -- Add new constraint linking to users
    ALTER TABLE properties ADD CONSTRAINT fk_properties_users 
    FOREIGN KEY (builder_id) REFERENCES users(id) ON DELETE CASCADE;
END $$;

-- 3. Update 'payments' table
DO $$ 
BEGIN
    -- Drop old foreign key if exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'payments_builder_id_fkey') THEN
        ALTER TABLE payments DROP CONSTRAINT payments_builder_id_fkey;
    END IF;

    -- CRITICAL FIX: Remove payments that reference non-existent users
    DELETE FROM payments WHERE builder_id NOT IN (SELECT id FROM users);
    
    ALTER TABLE payments ADD CONSTRAINT fk_payments_users 
    FOREIGN KEY (builder_id) REFERENCES users(id) ON DELETE CASCADE;
END $$;

-- 4. Drop 'builders' table
DROP TABLE IF EXISTS builders CASCADE;

-- 5. Data Cleanup (Optional)
-- Remove any users/properties that have invalid references if necessary.
-- DELETE FROM properties WHERE builder_id NOT IN (SELECT id FROM users);

COMMIT;
