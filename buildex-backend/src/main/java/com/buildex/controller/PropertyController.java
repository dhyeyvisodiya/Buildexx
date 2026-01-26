package com.buildex.controller;

import com.buildex.entity.Property;
import com.buildex.entity.User;
import com.buildex.entity.Builder;
import com.buildex.repository.UserRepository;
import com.buildex.repository.BuilderRepository;
import com.buildex.service.PropertyService;
import com.buildex.service.impl.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;
    private final BuilderRepository builderRepository;

    public PropertyController(PropertyService propertyService, FileStorageService fileStorageService,
            UserRepository userRepository, BuilderRepository builderRepository) {
        this.propertyService = propertyService;
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
        this.builderRepository = builderRepository;
    }

    @PostMapping("/builder/{builderId}")
    public ResponseEntity<Property> createProperty(@PathVariable Long builderId, @RequestBody Property property) {
        Property createdProperty = propertyService.createProperty(builderId, property);
        return new ResponseEntity<>(createdProperty, HttpStatus.CREATED);
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

    // OPTIMIZED: Return Summaries (DTO) instead of Full Entity for List View
    @GetMapping
    public ResponseEntity<List<com.buildex.model.PropertySummary>> getAllProperties() {
        // Fetches latest 20 properties as lightweight summaries
        return ResponseEntity.ok(propertyService.getAllPropertiesSummaries(0, 20).getContent());
    }

    @GetMapping("/paginated")
    public ResponseEntity<org.springframework.data.domain.Page<com.buildex.model.PropertySummary>> getAllPropertiesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(propertyService.getAllPropertiesSummaries(page, size));
    }

    @GetMapping("/{propertyId}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long propertyId) {
        Optional<Property> property = propertyService.getPropertyById(propertyId);
        return property.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/builder/{builderId}")
    public ResponseEntity<List<Property>> getPropertiesByBuilderId(@PathVariable Long builderId) {
        List<Property> properties = propertyService.getPropertiesByBuilderId(builderId);
        return ResponseEntity.ok(properties);
    }

    // Get properties by User ID (maps user email to builder email)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Property>> getPropertiesByUserId(@PathVariable Long userId) {
        // Find user by ID
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.ok(List.of()); // Return empty list if user not found
        }

        // Find builder with same email
        Optional<Builder> builderOpt = builderRepository.findByEmail(userOpt.get().getEmail());
        if (builderOpt.isEmpty()) {
            return ResponseEntity.ok(List.of()); // Return empty list if no matching builder
        }

        // Get properties by builder ID
        List<Property> properties = propertyService.getPropertiesByBuilderId(builderOpt.get().getId());
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
    public ResponseEntity<List<Property>> searchProperties(
            @RequestParam(required = false) Property.Purpose purpose,
            @RequestParam(required = false) Property.PropertyType propertyType,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) Property.AvailabilityStatus availabilityStatus) {
        List<Property> properties = propertyService.searchProperties(purpose, propertyType, city, area,
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
    public ResponseEntity<List<String>> uploadPanorama(@RequestParam("files") List<MultipartFile> files) {
        try {
            List<String> filePaths = new ArrayList<>();
            for (MultipartFile file : files) {
                // Use validate and store method for 360 images
                try {
                    String fileName = fileStorageService.store360Image(file);
                    if (fileName != null) {
                        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                                .path(fileName)
                                .toUriString();
                        filePaths.add(fileDownloadUri);
                    }
                } catch (IllegalArgumentException e) {
                    System.err.println(
                            "Upload validation failed for file " + file.getOriginalFilename() + ": " + e.getMessage());
                    return ResponseEntity.badRequest().body(Collections.singletonList("Error: " + e.getMessage()));
                }
            }
            return ResponseEntity.ok(filePaths);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Upload failed with unexpected error: " + e.getMessage());
            return ResponseEntity.badRequest().build();
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
        if (!"admin".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Property> propertyOpt = propertyService.verifyProperty(propertyId, isVerified);
        return propertyOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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