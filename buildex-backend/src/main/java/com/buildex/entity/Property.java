package com.buildex.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 5000) // Large text field for detailed description
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_type")
    private PropertyType propertyType;

    @Enumerated(EnumType.STRING)
    @Column(name = "purpose")
    private Purpose purpose; // BUY or RENT

    @Column(name = "price") // For buy
    private BigDecimal price;

    @Column(name = "rent_amount") // For rent
    private BigDecimal rentAmount;

    @Column(name = "deposit_amount")
    private BigDecimal depositAmount;

    @Column(name = "area_sqft")
    private Integer areaSqft;

    @Column(name = "bedrooms")
    private Integer bedrooms;

    @Column(name = "bathrooms")
    private Integer bathrooms;

    @ElementCollection
    @CollectionTable(name = "property_amenities", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "amenity")
    @org.hibernate.annotations.BatchSize(size = 50)
    private List<String> amenities;

    @Column(name = "possession_year")
    private Integer possessionYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "construction_status")
    private ConstructionStatus constructionStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status")
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "area", nullable = false)
    private String area;

    @Column(name = "google_map_link", columnDefinition = "TEXT")
    private String googleMapLink;

    @Column(name = "brochure_url", columnDefinition = "TEXT")
    private String brochureUrl;

    @Column(name = "virtual_tour_link", columnDefinition = "TEXT")
    private String virtualTourLink;

    @ElementCollection
    @CollectionTable(name = "property_images", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "image_url", columnDefinition = "TEXT")
    @org.hibernate.annotations.BatchSize(size = 50)
    private List<String> imageUrls;

    @Column(name = "legal_document_path", columnDefinition = "TEXT")
    private String legalDocumentPath;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "panorama_image_path", columnDefinition = "TEXT")
    private String panoramaImagePath;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "builder_id", nullable = false)
    private Builder builder;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum PropertyType {
        RESIDENTIAL, COMMERCIAL
    }

    public enum Purpose {
        BUY, RENT
    }

    public enum ConstructionStatus {
        UNDER_CONSTRUCTION, READY
    }

    public enum AvailabilityStatus {
        AVAILABLE, BOOKED, SOLD
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public PropertyType getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(PropertyType propertyType) {
        this.propertyType = propertyType;
    }

    public Purpose getPurpose() {
        return purpose;
    }

    public void setPurpose(Purpose purpose) {
        this.purpose = purpose;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getRentAmount() {
        return rentAmount;
    }

    public void setRentAmount(BigDecimal rentAmount) {
        this.rentAmount = rentAmount;
    }

    public BigDecimal getDepositAmount() {
        return depositAmount;
    }

    public void setDepositAmount(BigDecimal depositAmount) {
        this.depositAmount = depositAmount;
    }

    public Integer getAreaSqft() {
        return areaSqft;
    }

    public void setAreaSqft(Integer areaSqft) {
        this.areaSqft = areaSqft;
    }

    public Integer getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(Integer bedrooms) {
        this.bedrooms = bedrooms;
    }

    public Integer getBathrooms() {
        return bathrooms;
    }

    public void setBathrooms(Integer bathrooms) {
        this.bathrooms = bathrooms;
    }

    public List<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<String> amenities) {
        this.amenities = amenities;
    }

    public Integer getPossessionYear() {
        return possessionYear;
    }

    public void setPossessionYear(Integer possessionYear) {
        this.possessionYear = possessionYear;
    }

    public ConstructionStatus getConstructionStatus() {
        return constructionStatus;
    }

    public void setConstructionStatus(ConstructionStatus constructionStatus) {
        this.constructionStatus = constructionStatus;
    }

    public AvailabilityStatus getAvailabilityStatus() {
        return availabilityStatus;
    }

    public void setAvailabilityStatus(AvailabilityStatus availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getGoogleMapLink() {
        return googleMapLink;
    }

    public void setGoogleMapLink(String googleMapLink) {
        this.googleMapLink = googleMapLink;
    }

    public String getBrochureUrl() {
        return brochureUrl;
    }

    public void setBrochureUrl(String brochureUrl) {
        this.brochureUrl = brochureUrl;
    }

    public String getVirtualTourLink() {
        return virtualTourLink;
    }

    public void setVirtualTourLink(String virtualTourLink) {
        this.virtualTourLink = virtualTourLink;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public String getLegalDocumentPath() {
        return legalDocumentPath;
    }

    public void setLegalDocumentPath(String legalDocumentPath) {
        this.legalDocumentPath = legalDocumentPath;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public String getPanoramaImagePath() {
        return panoramaImagePath;
    }

    public void setPanoramaImagePath(String panoramaImagePath) {
        this.panoramaImagePath = panoramaImagePath;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Builder getBuilder() {
        return builder;
    }

    public void setBuilder(Builder builder) {
        this.builder = builder;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}