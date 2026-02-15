package com.buildex.controller;

import com.buildex.entity.Property;
import com.buildex.entity.User;
import com.buildex.repository.UserRepository;
import com.buildex.service.PropertyService;
import com.buildex.service.impl.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.buildex.dto.PropertySummaryDTO;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PropertyController {

    private final PropertyService propertyService;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    public PropertyController(PropertyService propertyService, FileStorageService fileStorageService,
            UserRepository userRepository) {
        this.propertyService = propertyService;
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
    }

    @PostMapping("/builder/{userId}")
    public ResponseEntity<?> createProperty(@PathVariable Long userId, @RequestBody Property property) {
        // Log the incoming request
        System.out.println("Received Create Property Request for User ID: " + userId);
        System.out.println("Property Payload: " + property);

        // ID Mismatch Fixed: Builder ID is now same as User ID
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.badRequest().body("User not found with ID " + userId);
        }

        // Optional: Check if role is builder
        userRepository.findById(userId).ifPresent(user -> {
            if (!"builder".equalsIgnoreCase(user.getRole())) {
                // throw new RuntimeException("User is not a builder"); // Or handle gracefully
            }
        });

        try {
            Property createdProperty = propertyService.createProperty(userId, property);
            return new ResponseEntity<>(createdProperty, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating property: " + e.getMessage());
        }
    }

    @PostMapping("/upload-images")
    public ResponseEntity<String[]> uploadPropertyImages(@RequestParam("files") MultipartFile[] files) {
        try {
            String[] fileUrls = fileStorageService.storeMultipleFiles(files);
            return ResponseEntity.ok(fileUrls);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // OPTIMIZED: Return Summaries (DTO) with Pagination
    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Page<PropertySummaryDTO>> getAllProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(propertyService.getAllPropertiesSummaries(page, size));
    }

    // Admin: Get ALL properties (including unverified)
    @GetMapping("/all")
    public ResponseEntity<List<PropertySummaryDTO>> getAllPropertiesForAdmin() {
        return ResponseEntity.ok(propertyService.getAllPropertiesForAdmin());
    }

    @GetMapping("/cities")
    public ResponseEntity<List<String>> getAllCities() {
        return ResponseEntity.ok(propertyService.getAllCities());
    }

    @GetMapping("/{propertyId}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long propertyId) {
        Optional<Property> property = propertyService.getPropertyByIdEager(propertyId);
        return property.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/builder/{builderId}")
    public ResponseEntity<List<Property>> getPropertiesByBuilderId(@PathVariable Long builderId) {
        List<Property> properties = propertyService.getPropertiesByBuilderId(builderId);
        return ResponseEntity.ok(properties);
    }

    // Get properties by User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Property>> getPropertiesByUserId(@PathVariable Long userId) {
        // Find user by ID
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.ok(List.of()); // Return empty list if user not found
        }

        // Get properties by builder ID (which is userId)
        List<Property> properties = propertyService.getPropertiesByBuilderId(userId);
        return ResponseEntity.ok(properties);
    }

    @PutMapping("/{propertyId}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long propertyId,
            @RequestBody Property updatedProperty) {
        Optional<Property> propertyOpt = propertyService.updateProperty(propertyId, updatedProperty);
        return propertyOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{propertyId}/availability")
    public ResponseEntity<Property> updateAvailabilityStatus(@PathVariable Long propertyId,
            @RequestParam Property.AvailabilityStatus status) {
        Optional<Property> propertyOpt = propertyService.updateAvailabilityStatus(propertyId, status);
        return propertyOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{propertyId}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long propertyId) {
        propertyService.deleteProperty(propertyId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<PropertySummaryDTO>> searchProperties(
            @RequestParam(required = false) Property.Purpose purpose,
            @RequestParam(required = false) Property.PropertyType propertyType,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) Property.AvailabilityStatus availabilityStatus) {
        List<PropertySummaryDTO> properties = propertyService.searchPropertiesSummaries(purpose, propertyType, city,
                area,
                availabilityStatus);
        return ResponseEntity.ok(properties);
    }

    @PostMapping("/upload-legal-doc")
    public ResponseEntity<String> uploadLegalDocument(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = fileStorageService.storePrivateFile(file);
            return ResponseEntity.ok(fileName);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/upload-panorama")
    public ResponseEntity<?> uploadPanorama(@RequestParam("files") List<MultipartFile> files) {
        try {
            java.util.List<java.util.concurrent.CompletableFuture<String>> futures = files.stream()
                    .map(file -> java.util.concurrent.CompletableFuture.supplyAsync(() -> {
                        try {
                            return fileStorageService.store360Image(file);
                        } catch (Exception e) {
                            System.err.println("Panorama individual upload failed: " + e.getMessage());
                            throw new java.util.concurrent.CompletionException(e);
                        }
                    }))
                    .collect(java.util.stream.Collectors.toList());

            java.util.List<String> filePaths = futures.stream()
                    .map(java.util.concurrent.CompletableFuture::join)
                    .filter(java.util.Objects::nonNull)
                    .collect(java.util.stream.Collectors.toList());

            return ResponseEntity.ok(filePaths);
        } catch (Exception e) {
            String errorMessage = e.getMessage();
            if (e instanceof java.util.concurrent.CompletionException && e.getCause() != null) {
                errorMessage = e.getCause().getMessage();
            }
            System.err.println("Panorama upload failed: " + errorMessage);
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", errorMessage));
        }
    }

    @GetMapping("/{propertyId}/legal-doc")
    public ResponseEntity<Resource> getLegalDocument(@PathVariable Long propertyId, @RequestParam Long userId) {
        try {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            if (!"admin".equalsIgnoreCase(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Property property = propertyService.getPropertyById(propertyId)
                    .orElseThrow(() -> new RuntimeException("Property not found"));
            String fileName = property.getLegalDocumentPath();

            if (fileName == null) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = fileStorageService.loadPrivateFile(fileName);
            return ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/{propertyId}/verify")
    public ResponseEntity<Property> verifyProperty(@PathVariable Long propertyId,
            @RequestParam Boolean isVerified,
            @RequestParam Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        // if (!"admin".equalsIgnoreCase(user.getRole())) {
        // return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        // }

        Optional<Property> propertyOpt = propertyService.verifyProperty(propertyId, isVerified);
        return propertyOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{propertyId}/brochure")
    public ResponseEntity<Resource> getBrochure(@PathVariable Long propertyId) {
        try {
            Property property = propertyService.getPropertyById(propertyId)
                    .orElseThrow(() -> new RuntimeException("Property not found"));

            String brochureUrl = property.getBrochureUrl();
            if (brochureUrl == null || brochureUrl.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Extract filename from URL/path
            String fileName = brochureUrl.substring(brochureUrl.lastIndexOf("/") + 1);

            // Try to load from uploads (public) first, then secure (if logic changes)
            java.nio.file.Path filePath = java.nio.file.Paths.get(System.getProperty("user.dir")
                    + java.io.File.separator + "uploads" + java.io.File.separator + fileName);
            Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // =============================================
    // PROXY 360 IMAGE ENDPOINT
    // =============================================
    @PostMapping("/images/proxy-360")
    public ResponseEntity<?> proxy360Image(@RequestBody Map<String, String> payload) {
        try {
            String url = payload.get("url");
            if (url == null || url.isEmpty()) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "URL is required"));
            }

            // Simple validation to prevent SSRF (allow mostly common image hosts or
            // internal)
            // For now, allow all but in production should whitelist domains
            URI uri = new URI(url);

            // If it's a local path, return it as is
            if (url.startsWith("/") || url.contains("localhost")) {
                return ResponseEntity.ok(Collections.singletonMap("localUrl", url));
            }

            // In a real implementation, you would download the file to a temp location
            // and serve it from there to bypass CORS.
            // For this MVP, we will assume the client handles CORS or the image is
            // accessible.
            // If CORS is strictly blocking, we would need to implement a full proxy here
            // using RestTemplate.

            // Returning the original URL as we expect client-side handling or allowed CORS
            // headers from source
            return ResponseEntity.ok(Collections.singletonMap("localUrl", url));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to proxy image: " + e.getMessage()));
        }
    }
}