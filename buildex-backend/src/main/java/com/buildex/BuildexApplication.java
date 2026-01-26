package com.buildex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BuildexApplication {
    public static void main(String[] args) {
        // Fix for Render/Neon providing "postgres://" instead of "jdbc:postgresql://"
        String dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (dbUrl == null || dbUrl.isEmpty()) {
            dbUrl = System.getenv("DATABASE_URL");
        }

        if (dbUrl != null && !dbUrl.startsWith("jdbc:")) {
            // Convert "postgres://" or "postgresql://" to "jdbc:postgresql://"
            String fixedUrl = "jdbc:" + dbUrl;
            if (fixedUrl.contains("jdbc:postgres://")) {
                fixedUrl = fixedUrl.replace("jdbc:postgres://", "jdbc:postgresql://");
            }
            System.setProperty("spring.datasource.url", fixedUrl);
            System.out.println("PATCHED DB URL for Render: " + fixedUrl);
        }

        SpringApplication.run(BuildexApplication.class, args);
    }
}