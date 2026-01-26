package com.buildex.config;

import com.buildex.entity.Builder;
import com.buildex.entity.Property;
import com.buildex.repository.BuilderRepository;
import com.buildex.repository.PropertyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashSet;

@Component
public class DataSeeder implements CommandLineRunner {

    private final BuilderRepository builderRepository;
    private final PropertyRepository propertyRepository;

    public DataSeeder(BuilderRepository builderRepository, PropertyRepository propertyRepository) {
        this.builderRepository = builderRepository;
        this.propertyRepository = propertyRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (builderRepository.count() == 0) {
            System.out.println("No builders found. Seeding sample data...");

            // Create Builder
            Builder builder = new Builder();
            builder.setCompanyName("DV(Builder)");
            builder.setOwnerName("DVBhai");
            builder.setEmail("visodiyadhyey@gmail.com");
            builder.setPhone("123456789");
            builder.setVerificationStatus(Builder.VerificationStatus.VERIFIED);

            builder = builderRepository.save(builder);
            System.out.println("Sample Builder created: " + builder.getCompanyName());

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
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"));

            // Set Amenities
            property.setAmenities(Arrays.asList("Gym", "Parking", "Security"));

            // Set 360 Images
            property.setPanoramaImages(Arrays.asList(
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Stonehenge_360_degree_panorama.jpg/1280px-Stonehenge_360_degree_panorama.jpg"));

            propertyRepository.save(property);
            System.out.println("Sample Property created: " + property.getTitle());

        } else {
            System.out.println("Database already contains data. Skipping seed.");
        }
    }
}
