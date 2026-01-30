package com.buildex.config;

import com.buildex.entity.User;
import com.buildex.entity.Property;
import com.buildex.repository.UserRepository;
import com.buildex.repository.PropertyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    public DataSeeder(UserRepository userRepository, PropertyRepository propertyRepository) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Properties if none exist
        if (propertyRepository.count() == 0) {
            System.out.println("No properties found. Seeding sample property data...");

            // Find an existing builder or create one
            User builder = userRepository.findAll().stream()
                    .filter(u -> "builder".equalsIgnoreCase(u.getRole()))
                    .findFirst()
                    .orElseGet(() -> {
                        System.out.println("No builder found. Creating sample builder...");
                        User newBuilder = new User();
                        newBuilder.setUsername("dvbhai");
                        newBuilder.setEmail("visodiyadhyey@gmail.com");
                        newBuilder.setPassword("123456");
                        newBuilder.setFullName("DVBhai");
                        newBuilder.setPhone("123456789");
                        newBuilder.setRole("builder");
                        newBuilder.setStatus("active");
                        newBuilder.setCompanyName("DV(Builder)");
                        newBuilder.setVerificationStatus(User.VerificationStatus.VERIFIED);
                        return userRepository.save(newBuilder);
                    });

            System.out.println("Using Builder: " + builder.getCompanyName());

            // Create Property
            Property property = new Property();
            property.setTitle("Luxury 3BHK Apartment");
            property.setDescription("Beautiful 3BHK apartment with modern amenities in the heart of the city.");
            property.setPropertyType(Property.PropertyType.RESIDENTIAL);
            property.setPurpose(Property.Purpose.RENT);
            property.setRentAmount(new BigDecimal("25000.00"));
            property.setAreaSqft(1500);
            property.setCity("Mumbai");
            property.setArea("Bandra");
            property.setConstructionStatus(Property.ConstructionStatus.READY);
            property.setAvailabilityStatus(Property.AvailabilityStatus.AVAILABLE);
            property.setBuilder(builder); // Link to builder

            // Set Images (Using Arrays.asList directly as Entity expects List)
            property.setImageUrls(Arrays.asList(
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"));

            // Set Amenities
            property.setAmenities(Arrays.asList("Gym", "Parking", "Security", "Pool"));

            // Set 360 Images
            property.setPanoramaImages(Arrays.asList(
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Stonehenge_360_degree_panorama.jpg/1280px-Stonehenge_360_degree_panorama.jpg"));

            propertyRepository.save(property);
            System.out.println("Sample Property created: " + property.getTitle());
        } else {
            System.out.println("Properties already exist. Skipping seed.");
        }
    }
}
