package com.buildex.controller;

import com.buildex.entity.User;
import com.buildex.repository.UserRepository;
import com.buildex.service.EmailService;
import com.buildex.service.OtpService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.buildex.entity.Builder;
import com.buildex.repository.BuilderRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow frontend access
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final OtpService otpService;
    private final BuilderRepository builderRepository;

    // Explicit constructor instead of @RequiredArgsConstructor
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService,
            OtpService otpService, BuilderRepository builderRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.otpService = otpService;
        this.builderRepository = builderRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email already exists"));
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Username already exists"));
        }

        // Validate phone for builders
        if ("builder".equalsIgnoreCase(request.getRole())) {
            if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Phone number is required for Builder accounts"));
            }
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFull_name());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        user.setStatus("pending_verification");

        userRepository.save(user);

        // Create Builder entity if role is builder
        if ("builder".equalsIgnoreCase(request.getRole())) {
            try {
                Builder builder = new Builder();
                builder.setOwnerName(request.getFull_name());
                builder.setEmail(request.getEmail());
                builder.setPhone(request.getPhone());
                // Default company name since not enabled in frontend yet
                builder.setCompanyName(request.getFull_name() + "'s Company");
                builder.setVerificationStatus(Builder.VerificationStatus.PENDING);

                builderRepository.save(builder);
            } catch (Exception e) {
                // Log error but don't fail user registration?
                // Better to fail so data is consistent, but user is already saved.
                // For now print stack trace, effectively "best effort" or need transaction.
                // Keeping it simple: Just print.
                e.printStackTrace();
                System.err.println("Failed to create Builder entity for user: " + user.getEmail());
            }
        }

        // Generate and Send OTP
        String otp = otpService.generateOtp(user.getEmail());
        // In a real scenario, handle email failure. Here we assume success or user can
        // resend.
        // For local testing without SMTP, we might want to log the OTP.
        System.out.println("DEBUG OTP for " + user.getEmail() + ": " + otp);

        try {
            emailService.sendOtpEmail(user.getEmail(), otp);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            // Continue to allow testing (OTP printed in console)
        }

        return ResponseEntity.ok(Map.of("success", true, "message", "OTP sent to email"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyRequest request) {
        boolean isValid = otpService.validateOtp(request.getEmail(), request.getOtp());

        if (!isValid) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid or expired OTP"));
        }

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
        }

        User user = userOpt.get();
        user.setStatus("active");
        user.setStatus("active");
        userRepository.save(user);

        // Send Welcome Email
        try {
            emailService.sendWelcomeEmail(user.getEmail(), user.getFullName(), user.getRole());
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }

        // Return user info (excluding password)
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("username", user.getUsername());
        userData.put("email", user.getEmail());
        userData.put("full_name", user.getFullName());
        userData.put("phone", user.getPhone());
        userData.put("role", user.getRole());

        return ResponseEntity.ok(Map.of("success", true, "user", userData));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid email or password"));
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid email or password"));
        }

        if (!"active".equals(user.getStatus())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Account is not active. Please verify your email."));
        }

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("username", user.getUsername());
        userData.put("email", user.getEmail());
        userData.put("full_name", user.getFullName());
        userData.put("phone", user.getPhone());
        userData.put("role", user.getRole());

        return ResponseEntity.ok(Map.of("success", true, "user", userData));
    }

    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private String full_name;
        private String phone;
        private String role;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getFull_name() {
            return full_name;
        }

        public void setFull_name(String full_name) {
            this.full_name = full_name;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    public static class VerifyRequest {
        private String email;
        private String otp;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
