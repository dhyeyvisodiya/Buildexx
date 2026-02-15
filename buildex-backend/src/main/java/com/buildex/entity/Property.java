package com.buildex.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "properties", indexes = {
        @Index(name = "idx_property_city", columnList = "city"),
        @Index(name = "idx_property_purpose", columnList = "purpose"),
        @Index(name = "idx_property_type", columnList = "property_type"),
        @Index(name = "idx_property_price", columnList = "price"),
        @Index(name = "idx_property_rent", columnList = "rent_amount"),
        @Index(name = "idx_property_status", columnList = "availability_status")
})
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Data // Restored
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "property_amenities", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "amenity")
    @org.hibernate.annotations.BatchSize(size = 50)
    private java.util.Set<String> amenities;

    @Column(name = "possession_year")
    private Integer possessionYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "construction_status")
    private ConstructionStatus constructionStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status")
    @Builder.Default
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "area", nullable = false)
    @JsonIgnore // Prevent direct mapping from "area" JSON key (which is SqFt in frontend)
    private String area;

    @Column(name = "google_map_link", columnDefinition = "TEXT")
    private String googleMapLink;

    @Column(name = "brochure_url", columnDefinition = "TEXT")
    private String brochureUrl;

    @Column(name = "virtual_tour_link", columnDefinition = "TEXT")
    private String virtualTourLink;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "property_images", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "image_url", columnDefinition = "TEXT")
    @OrderColumn(name = "image_order")
    @org.hibernate.annotations.BatchSize(size = 50)
    private List<String> imageUrls;

    @Column(name = "legal_document_path", columnDefinition = "TEXT")
    private String legalDocumentPath;

    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = false;

    @Column(name = "panorama_image_path", columnDefinition = "TEXT")
    private String panoramaImagePath;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "property_panorama_images", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "panorama_image_url", columnDefinition = "TEXT")
    @OrderColumn(name = "image_order")
    @org.hibernate.annotations.BatchSize(size = 50)
    @JsonProperty("panorama_images")
    private List<String> panoramaImages;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "builder_id", nullable = false)
    @JsonIgnore
    private User builder;

    // =============================================
    // CASCADE DELETE RELATIONSHIPS
    // =============================================

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Payment> payments;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Complaint> complaints;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Enquiry> enquiries;

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
        AVAILABLE, BOOKED, SOLD, RENTED
    }

    // Getters and Setters handled by @Data annotation

    // =============================================
    // JSON ALIAS GETTERS FOR FRONTEND COMPATIBILITY
    // =============================================

    @JsonProperty("status")
    public String getStatus() {
        if (isVerified == null)
            return "pending";
        return isVerified ? "approved" : "pending";
    }

    @JsonProperty("name")
    public String getName() {
        return title;
    }

    @JsonProperty("images")
    public List<String> getImages() {
        return imageUrls;
    }

    @JsonProperty("area")
    public Integer getAreaAlias() {
        return areaSqft;
    }

    @JsonProperty("locality")
    public String getLocality() {
        return area;
    }

    @JsonProperty("possession")
    public Integer getPossession() {
        return possessionYear;
    }

    @JsonProperty("availability")
    public AvailabilityStatus getAvailability() {
        return availabilityStatus;
    }

    @JsonProperty("rent")
    public BigDecimal getRent() {
        return rentAmount;
    }

    @JsonProperty("rent_amount")
    public BigDecimal getRentAmountAlias() {
        return rentAmount;
    }

    @JsonProperty("type")
    public PropertyType getType() {
        return propertyType;
    }

    @JsonProperty("construction_status")
    public ConstructionStatus getConstructionStatusAlias() {
        return constructionStatus;
    }

    @JsonProperty("brochure_url")
    public String getBrochureUrlAlias() {
        return brochureUrl;
    }

    @JsonProperty("google_map_link")
    public String getGoogleMapLinkAlias() {
        return googleMapLink;
    }

    @JsonProperty("virtual_tour_link")
    public String getVirtualTourLinkAlias() {
        return virtualTourLink;
    }

    @JsonProperty("panorama_image_path")
    public String getPanoramaImagePathAlias() {
        return panoramaImagePath;
    }

    @JsonProperty("builder_id")
    public Long getBuilderId() {
        return builder != null ? builder.getId() : null;
    }

    @JsonProperty("builder_name")
    public String getBuilderName() {
        if (builder == null)
            return null;
        if (builder.getCompanyName() != null && !builder.getCompanyName().isEmpty())
            return builder.getCompanyName();
        if (builder.getFullName() != null && !builder.getFullName().isEmpty())
            return builder.getFullName();
        return builder.getUsername();
    }

    @JsonProperty("virtualTours")
    public List<String> getVirtualTours() {
        return panoramaImages;
    }

    // Add explicit getter for panoramaImages for serialization if needed,
    // but @Data usually handles field-based serialization if not hidden.
    // However, we want to ensure it's available.
    // =============================================
    // JSON ALIAS SETTERS FOR FRONTEND COMPATIBILITY
    // =============================================

    @JsonProperty("area")
    public void setAreaSqftAlias(Integer areaSqft) {
        this.areaSqft = areaSqft;
    }

    @JsonProperty("locality")
    public void setLocalityAlias(String locality) {
        this.area = locality;
    }

    @JsonProperty("possession")
    public void setPossessionAlias(Integer possessionYear) {
        this.possessionYear = possessionYear;
    }

    @JsonProperty("rent_amount")
    public void setRentAmountAlias(BigDecimal rentAmount) {
        this.rentAmount = rentAmount;
    }

    @JsonProperty("construction_status")
    public void setConstructionStatusAlias(ConstructionStatus constructionStatus) {
        this.constructionStatus = constructionStatus;
    }

    @JsonProperty("brochure_url")
    public void setBrochureUrlAlias(String brochureUrl) {
        this.brochureUrl = brochureUrl;
    }

    @JsonProperty("google_map_link")
    public void setGoogleMapLinkAlias(String googleMapLink) {
        this.googleMapLink = googleMapLink;
    }

    @JsonProperty("virtual_tour_link")
    public void setVirtualTourLinkAlias(String virtualTourLink) {
        this.virtualTourLink = virtualTourLink;
    }

    @JsonProperty("panorama_image_path")
    public void setPanoramaImagePathAlias(String panoramaImagePath) {
        this.panoramaImagePath = panoramaImagePath;
    }

    @JsonProperty("images")
    public void setImagesAlias(List<String> images) {
        this.imageUrls = images;
    }

    public List<String> getPanoramaImages() {
        return panoramaImages;
    }
}