-- Fix for payments table foreign key constraint error
-- The constraint is referencing a non-existent 'builders' table instead of 'users'

-- Step 1: Drop the incorrect foreign key constraint
ALTER TABLE payments DROP CONSTRAINT IF EXISTS fklckv9qdocdkqxhlusvupgw0nw;

-- Step 2: Also drop any other auto-generated FK constraints on builder_id that might be wrong
-- (Hibernate may have created other variations)
DO $$ 
DECLARE
    constraint_name TEXT;
BEGIN
    FOR constraint_name IN 
        SELECT conname 
        FROM pg_constraint c
        JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
        WHERE c.conrelid = 'payments'::regclass 
        AND c.contype = 'f'
        AND a.attname = 'builder_id'
    LOOP
        EXECUTE 'ALTER TABLE payments DROP CONSTRAINT IF EXISTS ' || constraint_name;
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END LOOP;
END $$;

-- Step 3: Add the correct foreign key constraint referencing 'users' table
ALTER TABLE payments 
ADD CONSTRAINT fk_payments_builder 
FOREIGN KEY (builder_id) 
REFERENCES users(id) 
ON DELETE SET NULL;

-- Verify the fix
SELECT conname, pg_get_constraintdef(c.oid) 
FROM pg_constraint c 
WHERE c.conrelid = 'payments'::regclass 
AND c.contype = 'f';
