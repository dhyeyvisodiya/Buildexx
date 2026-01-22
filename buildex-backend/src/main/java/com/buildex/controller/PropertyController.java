package com.buildex.controller;

import com.buildex.entity.Property;
import com.buildex.entity.User;
import com.buildex.repository.UserRepository;
import com.buildex.service.PropertyService;
import com.buildex.service.impl.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*")
public class PropertyController {

    private final PropertyService propertyService;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    public PropertyController(PropertyService propertyService, FileStorageService fileStorageService, UserRepository userRepository) {
        this.propertyService = propertyService;
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
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

    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties() {
        List<Property> properties = propertyService.getAllProperties();
        return ResponseEntity.ok(properties);
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
                String fileName = fileStorageService.storeFile(file);
                if (fileName != null) {
                    // fileName already starts with /uploads/
                    String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                            .path(fileName)
                            .toUriString();
                    filePaths.add(fileDownloadUri);
                }
            }
            return ResponseEntity.ok(filePaths);
        } catch (Exception e) {
            e.printStackTrace();
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
}