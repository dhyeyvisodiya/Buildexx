package com.buildex.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;

@Service
public class FileStorageService {

    private final String UPLOAD_DIR;
    private final String SECURE_UPLOAD_DIR;

    public FileStorageService() {
        // Use user.dir to ensure we write to the application's working directory
        String baseDir = System.getProperty("user.dir");
        this.UPLOAD_DIR = baseDir + File.separator + "uploads" + File.separator;
        this.SECURE_UPLOAD_DIR = baseDir + File.separator + "secure_uploads" + File.separator;

        System.out.println("FileStorageService initialized.");
        System.out.println("Upload Directory: " + UPLOAD_DIR);
        System.out.println("Secure Upload Directory: " + SECURE_UPLOAD_DIR);

        // Create upload directory if it doesn't exist
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            boolean created = uploadDir.mkdirs();
            System.out.println("Created upload directory: " + created);
        }
        File secureUploadDir = new File(SECURE_UPLOAD_DIR);
        if (!secureUploadDir.exists()) {
            boolean created = secureUploadDir.mkdirs();
            System.out.println("Created secure upload directory: " + created);
        }
    }

    public String storeFile(MultipartFile file) throws IOException {
        // Generate a unique filename
        String originalFileName = file.getOriginalFilename();
        String extension = originalFileName != null ? originalFileName.substring(originalFileName.lastIndexOf("."))
                : "";
        String uniqueFileName = UUID.randomUUID().toString() + extension;

        // Create the file path
        Path filePath = Paths.get(UPLOAD_DIR).resolve(uniqueFileName);

        // OPTIMIZATION: Resize image if it's an image file
        try {
            BufferedImage originalImage = ImageIO.read(file.getInputStream());
            if (originalImage != null) {
                // Resize if width > 1024
                if (originalImage.getWidth() > 1024) {
                    int newWidth = 1024;
                    int newHeight = (int) Math.round(originalImage.getHeight() * (1024.0 / originalImage.getWidth()));
                    BufferedImage resized = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
                    java.awt.Graphics2D g2d = resized.createGraphics();
                    g2d.setRenderingHint(java.awt.RenderingHints.KEY_INTERPOLATION,
                            java.awt.RenderingHints.VALUE_INTERPOLATION_BILINEAR);
                    g2d.drawImage(originalImage, 0, 0, newWidth, newHeight, null);
                    g2d.dispose();

                    String ext = extension.replace(".", "");
                    if (ext.isEmpty())
                        ext = "jpg"; // Default
                    ImageIO.write(resized, ext, filePath.toFile());
                } else {
                    Files.copy(file.getInputStream(), filePath);
                }
            } else {
                // Not an image or ImageIO failed, just copy
                Files.copy(file.getInputStream(), filePath);
            }
        } catch (Exception e) {
            // Fallback
            System.err.println("Resize failed: " + e.getMessage());
            if (!Files.exists(filePath)) {
                Files.copy(file.getInputStream(), filePath);
            }
        }

        return "/uploads/" + uniqueFileName;
    }

    public String[] storeMultipleFiles(MultipartFile[] files) throws IOException {
        String[] fileUrls = new String[files.length];
        for (int i = 0; i < files.length; i++) {
            fileUrls[i] = storeFile(files[i]);
        }
        return fileUrls;
    }

    public String storePrivateFile(MultipartFile file) throws IOException {
        // Generate a unique filename
        String originalFileName = file.getOriginalFilename();
        String extension = originalFileName != null ? originalFileName.substring(originalFileName.lastIndexOf("."))
                : "";
        String uniqueFileName = UUID.randomUUID().toString() + extension;

        // Create the file path
        Path filePath = Paths.get(SECURE_UPLOAD_DIR).resolve(uniqueFileName);

        // Copy file to target location
        Files.copy(file.getInputStream(), filePath);

        return uniqueFileName; // Return filename only, not path
    }

    public org.springframework.core.io.Resource loadPrivateFile(String fileName) throws java.net.MalformedURLException {
        Path filePath = Paths.get(SECURE_UPLOAD_DIR).resolve(fileName);
        java.net.URI uri = filePath.toUri();
        if (uri == null) {
            throw new RuntimeException("Could not retrieve URI for file: " + fileName);
        }
        org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(uri);
        if (resource.exists() || resource.isReadable()) {
            return resource;
        } else {
            throw new RuntimeException("Could not read file: " + fileName);
        }
    }

    public String storeRawFile(MultipartFile file) throws IOException {
        String originalFileName = file.getOriginalFilename();
        String extension = originalFileName != null ? originalFileName.substring(originalFileName.lastIndexOf("."))
                : "";
        String uniqueFileName = UUID.randomUUID().toString() + extension;
        Path filePath = Paths.get(UPLOAD_DIR).resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath);
        return "/uploads/" + uniqueFileName;
    }

    public String store360Image(MultipartFile file) throws IOException {
        // Validate aspect ratio (2:1)
        try (java.io.InputStream is = file.getInputStream()) {
            BufferedImage image = ImageIO.read(is);
            if (image == null) {
                // Determine via file extension if it's an image. If likely image but read
                // failed, warn but allow?
                // Or just throw.
                throw new IllegalArgumentException("Invalid image file: Unable to read image data");
            }
            // Allow small tolerance? No, 2:1 is standard for equirectangular.
            if (image.getWidth() != 2 * image.getHeight()) {
                throw new IllegalArgumentException(
                        "Invalid 360 Image: Aspect ratio must be exactly 2:1 (Width = 2 * Height). Uploaded dimensions: "
                                + image.getWidth() + "x" + image.getHeight());
            }
        }
        // Use raw store to avoid resizing 360 images (quality loss) and OOM
        return storeRawFile(file);
    }
}