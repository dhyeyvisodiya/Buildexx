package com.buildex.service;

import com.buildex.entity.Property;
import com.buildex.exception.ResourceNotFoundException;
import com.buildex.repository.PropertyRepository;
import com.buildex.repository.UserRepository;
import com.buildex.repository.ComplaintRepository;
import com.buildex.repository.EnquiryRepository;
import com.buildex.repository.RentRequestRepository;
import com.buildex.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import com.buildex.dto.PropertySummaryDTO;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final EnquiryRepository enquiryRepository;
    private final RentRequestRepository rentRequestRepository;
    private final PaymentRepository paymentRepository;

    public PropertyService(PropertyRepository propertyRepository,
            UserRepository userRepository,
            ComplaintRepository complaintRepository,
            EnquiryRepository enquiryRepository,
            RentRequestRepository rentRequestRepository,
            PaymentRepository paymentRepository) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.complaintRepository = complaintRepository;
        this.enquiryRepository = enquiryRepository;
        this.rentRequestRepository = rentRequestRepository;
        this.paymentRepository = paymentRepository;
    }

    public Property createProperty(Long userId, Property property) {
        return userRepository.findById(userId)
                .map(user -> {
                    // Start of Selection
                    if (!"builder".equalsIgnoreCase(user.getRole())) {
                        throw new IllegalArgumentException("User is not a builder");
                    }
                    property.setBuilder(user);
                    property.setIsVerified(false); // Force manual verification by admin
                    return propertyRepository.save(property);
                })
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    public Optional<Property> getPropertyById(Long id) {
        return propertyRepository.findById(id);
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Optional<Property> getPropertyByIdEager(Long id) {
        Optional<Property> propertyOpt = propertyRepository.findById(id);
        // Force-initialize lazy collections within the transaction
        propertyOpt.ifPresent(property -> {
            if (property.getImageUrls() != null)
                property.getImageUrls().size();
            if (property.getAmenities() != null)
                property.getAmenities().size();
            if (property.getPanoramaImages() != null)
                property.getPanoramaImages().size();
            if (property.getBuilder() != null)
                property.getBuilder().getCompanyName();
        });
        return propertyOpt;
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<PropertySummaryDTO> getAllPropertiesForAdmin() {
        return propertyRepository.findAllWithBuilder().stream()
                .map(this::convertToSummaryDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    public List<Property> getAllProperties() {
        // Default to fetching latest 20 properties for performance - ONLY VERIFIED
        return propertyRepository.findByIsVerifiedTrue(org.springframework.data.domain.PageRequest.of(0, 20,
                org.springframework.data.domain.Sort.by("createdAt").descending())).getContent();
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public org.springframework.data.domain.Page<PropertySummaryDTO> getAllPropertiesSummaries(int page,
            int size) {
        return propertyRepository.findByIsVerifiedTrue(org.springframework.data.domain.PageRequest.of(page, size,
                org.springframework.data.domain.Sort.by("createdAt").descending()))
                .map(this::convertToSummaryDTO);
    }

    private PropertySummaryDTO convertToSummaryDTO(Property property) {
        return PropertySummaryDTO.builder()
                .id(property.getId())
                .title(property.getTitle())
                .price(property.getPrice())
                .rentAmount(property.getRentAmount())
                .city(property.getCity())
                .area(property.getArea()) // Map locality
                // Efficiently fetch only the first image using native query
                .thumbnail(propertyRepository.findThumbnail(property.getId()))
                .type(property.getPropertyType())
                .purpose(property.getPurpose())
                .availability(property.getAvailabilityStatus())
                .bedrooms(property.getBedrooms())
                .bathrooms(property.getBathrooms())
                .areaSqft(property.getAreaSqft())
                .builderName(property.getBuilderName())
                .isVerified(property.getIsVerified())
                .status(property.getStatus())
                .latitude(property.getLatitude())
                .longitude(property.getLongitude())
                .legalDocumentPath(property.getLegalDocumentPath())
                .build();
    }

    public List<PropertySummaryDTO> searchPropertiesSummaries(Property.Purpose purpose,
            Property.PropertyType propertyType,
            String city,
            String area,
            Property.AvailabilityStatus availabilityStatus) {
        return propertyRepository.findByFilters(purpose, propertyType, city, area, availabilityStatus)
                .stream()
                .map(this::convertToSummaryDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    public org.springframework.data.domain.Page<Property> getAllProperties(int page, int size) {
        return propertyRepository.findByIsVerifiedTrue(org.springframework.data.domain.PageRequest.of(page, size,
                org.springframework.data.domain.Sort.by("createdAt").descending()));
    }

    public List<Property> getPropertiesByBuilderId(Long builderId) {
        return propertyRepository.findByBuilder_Id(builderId);
    }

    public Optional<Property> updateProperty(Long id, Property updatedProperty) {
        return propertyRepository.findById(id).map(existingProperty -> {
            // Update basic fields
            existingProperty.setTitle(updatedProperty.getTitle());
            existingProperty.setDescription(updatedProperty.getDescription());
            existingProperty.setPropertyType(updatedProperty.getPropertyType());
            existingProperty.setPurpose(updatedProperty.getPurpose());
            existingProperty.setPrice(updatedProperty.getPrice());
            existingProperty.setRentAmount(updatedProperty.getRentAmount());
            existingProperty.setDepositAmount(updatedProperty.getDepositAmount());
            existingProperty.setAreaSqft(updatedProperty.getAreaSqft());
            existingProperty.setBedrooms(updatedProperty.getBedrooms());
            existingProperty.setBathrooms(updatedProperty.getBathrooms());
            existingProperty.setPossessionYear(updatedProperty.getPossessionYear());
            existingProperty.setConstructionStatus(updatedProperty.getConstructionStatus());
            existingProperty.setAvailabilityStatus(updatedProperty.getAvailabilityStatus());
            existingProperty.setCity(updatedProperty.getCity());
            existingProperty.setArea(updatedProperty.getArea());
            existingProperty.setGoogleMapLink(updatedProperty.getGoogleMapLink());
            existingProperty.setBrochureUrl(updatedProperty.getBrochureUrl());
            existingProperty.setVirtualTourLink(updatedProperty.getVirtualTourLink());
            existingProperty.setLegalDocumentPath(updatedProperty.getLegalDocumentPath());
            existingProperty.setLatitude(updatedProperty.getLatitude());
            existingProperty.setLongitude(updatedProperty.getLongitude());

            // Update collections (Selective replacement/merge if needed)
            if (updatedProperty.getAmenities() != null) {
                existingProperty.setAmenities(updatedProperty.getAmenities());
            }
            if (updatedProperty.getImageUrls() != null) {
                existingProperty.setImageUrls(updatedProperty.getImageUrls());
            }
            if (updatedProperty.getPanoramaImages() != null) {
                existingProperty.setPanoramaImages(updatedProperty.getPanoramaImages());
            }

            // IMPORTANT: Never overwrite complaints, enquiries, payments, or the builder
            // Those relationships are managed by their respective entities or specific
            // flows

            return propertyRepository.save(existingProperty);
        });
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

    @org.springframework.transaction.annotation.Transactional
    public void deleteProperty(Long id) {
        // Delete related entities first to avoid FK constraint violations
        // RentRequest uses direct ID mapping, so we must delete manually
        rentRequestRepository.deleteByPropertyId(id);

        // Manually delete other related entities to avoid FK issues
        paymentRepository.deleteByPropertyId(id);
        complaintRepository.deleteByPropertyId(id);
        enquiryRepository.deleteByPropertyId(id);

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

    public List<String> getAllCities() {
        return propertyRepository.findAllCities();
    }
}