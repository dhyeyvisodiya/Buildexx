package com.buildex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
@EnableAsync
public class BuildexApplication {
    public static void main(String[] args) {
        SpringApplication.run(BuildexApplication.class, args);
    }

    @Bean
    public CommandLineRunner databaseCleaner(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute(
                        "UPDATE properties SET availability_status = UPPER(availability_status) WHERE availability_status IS NOT NULL");
                jdbcTemplate.execute(
                        "ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_availability_status_check");
            } catch (Exception e) {
                System.err.println("Startup migration: " + e.getMessage());
            }
        };
    }
}