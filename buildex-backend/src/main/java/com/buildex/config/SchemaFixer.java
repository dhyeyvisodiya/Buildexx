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

            // 3. Fix Panorama Images
            jdbcTemplate.execute(
                    "DELETE FROM property_panorama_images a USING property_panorama_images b WHERE a.ctid < b.ctid AND a.property_id = b.property_id AND a.panorama_image_url = b.panorama_image_url");
            jdbcTemplate.execute("ALTER TABLE property_panorama_images ADD COLUMN IF NOT EXISTS image_order INTEGER");
            jdbcTemplate.execute(
                    "WITH ordered_rows AS (SELECT property_id, panorama_image_url, ROW_NUMBER() OVER (PARTITION BY property_id ORDER BY panorama_image_url) - 1 as rn FROM property_panorama_images) UPDATE property_panorama_images SET image_order = ordered_rows.rn FROM ordered_rows WHERE property_panorama_images.property_id = ordered_rows.property_id AND property_panorama_images.panorama_image_url = ordered_rows.panorama_image_url");

            System.out.println("Schema Fixer completed successfully.");
        } catch (Exception e) {
            System.err.println("Schema Fixer encountered an error (might be already fixed): " + e.getMessage());
            // Consume error to allow startup
        }
    }
}
