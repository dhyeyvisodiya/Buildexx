package com.buildex.service;

import com.buildex.entity.Property;
import com.buildex.exception.ResourceNotFoundException;
import com.buildex.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final BuilderService builderService;

    public PropertyService(PropertyRepository propertyRepository, BuilderService builderService) {
        this.propertyRepository = propertyRepository;
        this.builderService = builderService;
    }

    public Property createProperty(Long builderId, Property property) {
        return builderService.getBuilderById(builderId)
                .map(builder -> {
                    property.setBuilder(builder);
                    return propertyRepository.save(property);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Builder not found with id: " + builderId));
    }

    public Optional<Property> getPropertyById(Long id) {
        return propertyRepository.findById(id);
    }

    public List<Property> getAllProperties() {
        // Default to fetching latest 20 properties for performance
        return propertyRepository.findAll(org.springframework.data.domain.PageRequest.of(0, 20,
                org.springframework.data.domain.Sort.by("createdAt").descending())).getContent();
    }

    public org.springframework.data.domain.Page<com.buildex.model.PropertySummary> getAllPropertiesSummaries(int page,
            int size) {
        return propertyRepository.findAllSummaries(org.springframework.data.domain.PageRequest.of(page, size,
                org.springframework.data.domain.Sort.by("createdAt").descending()));
    }

    public org.springframework.data.domain.Page<Property> getAllProperties(int page, int size) {
        return propertyRepository.findAll(org.springframework.data.domain.PageRequest.of(page, size,
                org.springframework.data.domain.Sort.by("createdAt").descending()));
    }

    public List<Property> getPropertiesByBuilderId(Long builderId) {
        return propertyRepository.findByBuilder_Id(builderId);
    }

    public Optional<Property> updateProperty(Long id, Property updatedProperty) {
        if (propertyRepository.existsById(id)) {
            updatedProperty.setId(id);
            // Ensure we don't nullify existing relationships if not provided in update
            // But since this is a PUT/PATCH, ideally we fetch, map fields, and save.
            // For now, let's stick to simple save but rely on frontend sending full object
            // or handle partials carefully.
            return Optional.of(propertyRepository.save(updatedProperty));
        }
        return Optional.empty();
    }

    public Optional<Property> updateAvailabilityStatus(Long id, Property.AvailabilityStatus status) {
        Optional<Property> propertyOpt = propertyRepository.findById(id);
        if (propertyOpt.isPresent()) {
            Property property = propertyOpt.get();
            property.setAvailabilityStatus(status);
            return Optional.of(propertyRepository.save(property));
        }
        return Optional.empty();
    }

    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }

    public List<Property> searchProperties(Property.Purpose purpose,
            Property.PropertyType propertyType,
            String city,
            String area,
            Property.AvailabilityStatus availabilityStatus) {
        return propertyRepository.findByFilters(purpose, propertyType, city, area, availabilityStatus);
    }

    public org.springframework.data.domain.Page<Property> searchProperties(Property.Purpose purpose,
            Property.PropertyType propertyType,
            String city,
            String area,
            Property.AvailabilityStatus availabilityStatus,
            int page, int size) {
        return propertyRepository.findByFiltersPaginated(purpose, propertyType, city, area, availabilityStatus,
                org.springframework.data.domain.PageRequest.of(page, size,
                        org.springframework.data.domain.Sort.by("createdAt").descending()));
    }

    public Optional<Property> verifyProperty(Long id, Boolean isVerified) {
        return propertyRepository.findById(id).map(property -> {
            property.setIsVerified(isVerified);
            return propertyRepository.save(property);
        });
    }
}