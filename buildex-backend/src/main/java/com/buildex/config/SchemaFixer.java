package com.buildex.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(1) // Run before DataSeeder
public class SchemaFixer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public SchemaFixer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("Running Schema Fixer...");

        try {
            // 1. Fix Property Amenities (Remove duplicates)
            jdbcTemplate.execute(
                    "DELETE FROM property_amenities a USING property_amenities b WHERE a.ctid < b.ctid AND a.property_id = b.property_id AND a.amenity = b.amenity");

            // 2. Fix Property Images (Remove duplicates & Add Order)
            jdbcTemplate.execute(
                    "DELETE FROM property_images a USING property_images b WHERE a.ctid < b.ctid AND a.property_id = b.property_id AND a.image_url = b.image_url");

            // Check if column exists, if not adds it (Postgres specific)
            jdbcTemplate.execute("ALTER TABLE property_images ADD COLUMN IF NOT EXISTS image_order INTEGER");

            // Populate order
            jdbcTemplate.execute(
                    "WITH ordered_rows AS (SELECT property_id, image_url, ROW_NUMBER() OVER (PARTITION BY property_id ORDER BY image_url) - 1 as rn FROM property_images) UPDATE property_images SET image_order = ordered_rows.rn FROM ordered_rows WHERE property_images.property_id = ordered_rows.property_id AND property_images.image_url = ordered_rows.image_url");

            // 4. Fix Withdrawals table (New project missing columns)
            System.out.println("Checking for missing columns in withdrawals table...");
            jdbcTemplate.execute("ALTER TABLE withdrawals ADD COLUMN IF NOT EXISTS commission_amount DECIMAL(19, 2)");
            jdbcTemplate.execute(
                    "ALTER TABLE withdrawals ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
            jdbcTemplate.execute(
                    "ALTER TABLE withdrawals ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
            jdbcTemplate.execute("ALTER TABLE withdrawals ADD COLUMN IF NOT EXISTS payout_amount DECIMAL(19, 2)");

            // 5. Fix Payments table (Ensure all columns exist)
            System.out.println("Checking for missing columns in payments table...");
            jdbcTemplate.execute("ALTER TABLE payments ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255)");
            jdbcTemplate.execute("ALTER TABLE payments ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(255)");
            jdbcTemplate.execute("ALTER TABLE payments ADD COLUMN IF NOT EXISTS razorpay_signature VARCHAR(255)");
            jdbcTemplate.execute("ALTER TABLE payments ADD COLUMN IF NOT EXISTS total_amount DECIMAL(19, 2)");
            jdbcTemplate.execute("ALTER TABLE payments ADD COLUMN IF NOT EXISTS remaining_amount DECIMAL(19, 2)");
            jdbcTemplate.execute("ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_type VARCHAR(50)");
            jdbcTemplate.execute("ALTER TABLE payments ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR'");

            System.out.println("Schema Fixer completed successfully.");
        } catch (Exception e) {
            System.err.println("Schema Fixer encountered an error (might be already fixed): " + e.getMessage());
            // Consume error to allow startup
        }
    }
}
