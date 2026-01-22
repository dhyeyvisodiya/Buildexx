package com.buildex.service;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ImageService {

    private final Path storageLocation;

    public ImageService() {
        this.storageLocation = Paths.get("uploads/360");
        try {
            Files.createDirectories(this.storageLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }

    public String saveImageFromUrl(String imageUrl) throws IOException {
        // Generate filename from MD5/UUID of string to ensure same URL = same file
        String extension = ".jpg";
        if (imageUrl.contains(".")) {
            int i = imageUrl.lastIndexOf('.');
            if (i > 0) {
                String extPart = imageUrl.substring(i);
                if (extPart.contains("?"))
                    extPart = extPart.split("\\?")[0];
                if (extPart.length() <= 5)
                    extension = extPart;
            }
        }

        String fileName = UUID.nameUUIDFromBytes(imageUrl.getBytes()).toString() + extension;
        Path targetPath = this.storageLocation.resolve(fileName);

        // If file exists, return it (cache)
        if (Files.exists(targetPath) && Files.size(targetPath) > 0) {
            return fileName;
        }

        URL url = new URL(imageUrl);
        try (InputStream in = url.openStream()) {
            Files.copy(in, targetPath, StandardCopyOption.REPLACE_EXISTING);
        }

        return fileName;
    }

    public Path getImagePath(String fileName) {
        return this.storageLocation.resolve(fileName).normalize();
    }
}
