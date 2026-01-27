package com.buildex.repository;

import com.buildex.entity.Property;
import com.buildex.entity.Property.AvailabilityStatus;
import com.buildex.entity.Property.Purpose;
import com.buildex.entity.Property.PropertyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
       List<Property> findByBuilder_Id(Long builderId);

       List<Property> findByPurpose(Purpose purpose);

       List<Property> findByPropertyType(PropertyType propertyType);

       List<Property> findByCity(String city);

       List<Property> findByCityAndArea(String city, String area);

       List<Property> findByAvailabilityStatus(AvailabilityStatus availabilityStatus);

       @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "builder", "amenities", "imageUrls",
                     "panoramaImages" })
       java.util.Optional<Property> findById(Long id);

       @Query("SELECT p FROM Property p LEFT JOIN FETCH p.builder WHERE " +
                     "(:purpose IS NULL OR p.purpose = :purpose) AND " +
                     "(:propertyType IS NULL OR p.propertyType = :propertyType) AND " +
                     "(:city IS NULL OR p.city = :city) AND " +
                     "(:area IS NULL OR p.area = :area) AND " +
                     "(:availabilityStatus IS NULL OR p.availabilityStatus = :availabilityStatus)")
       List<Property> findByFilters(@Param("purpose") Purpose purpose,
                     @Param("propertyType") PropertyType propertyType,
                     @Param("city") String city,
                     @Param("area") String area,
                     @Param("availabilityStatus") AvailabilityStatus availabilityStatus);

       @Query("SELECT p FROM Property p LEFT JOIN FETCH p.builder WHERE " +
                     "(:purpose IS NULL OR p.purpose = :purpose) AND " +
                     "(:propertyType IS NULL OR p.propertyType = :propertyType) AND " +
                     "(:city IS NULL OR p.city = :city) AND " +
                     "(:area IS NULL OR p.area = :area) AND " +
                     "(:availabilityStatus IS NULL OR p.availabilityStatus = :availabilityStatus)")
       org.springframework.data.domain.Page<Property> findByFiltersPaginated(@Param("purpose") Purpose purpose,
                     @Param("propertyType") PropertyType propertyType,
                     @Param("city") String city,
                     @Param("area") String area,
                     @Param("availabilityStatus") AvailabilityStatus availabilityStatus,
                     org.springframework.data.domain.Pageable pageable);
}