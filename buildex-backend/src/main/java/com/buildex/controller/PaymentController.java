package com.buildex.controller;

import com.buildex.entity.Payment;
import com.buildex.service.EmailService;
import com.buildex.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;
    private final com.buildex.service.EmailService emailService;

    public PaymentController(PaymentService paymentService, EmailService emailService) {
        this.paymentService = paymentService;
        this.emailService = emailService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Long> payload) {
        try {
            Long userId = payload.get("userId");
            Long propertyId = payload.get("propertyId");
            Payment payment = paymentService.createOrder(userId, propertyId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> payload) {
        try {
            String orderId = payload.get("razorpay_order_id");
            String paymentIdValue = payload.get("razorpay_payment_id");
            String signature = payload.get("razorpay_signature");

            Payment payment = paymentService.verifyPayment(orderId, paymentIdValue, signature);

            // Send Emails AFTER transaction commit (if successful)
            try {
                if (payment.getUser() != null && payment.getProperty() != null) {
                    emailService.sendPaymentSuccessEmail(
                            payment.getUser().getEmail(),
                            payment.getUser().getFullName(),
                            payment.getProperty().getTitle(),
                            payment.getAmount().toString(),
                            paymentIdValue);
                }
                if (payment.getProperty() != null && payment.getProperty().getBuilder() != null) {
                    com.buildex.entity.User builder = payment.getProperty().getBuilder();
                    String payerName = (payment.getUser() != null) ? payment.getUser().getFullName() : "Customer";
                    emailService.sendPaymentReceivedEmail(
                            builder.getEmail(),
                            builder.getCompanyName(),
                            payment.getProperty().getTitle(),
                            payment.getAmount().toString(),
                            payerName);
                }
            } catch (Exception ex) {
                // Don't fail the verification if emails fail
                System.err.println("Error sending payment emails: " + ex.getMessage());
            }

            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserPayments(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getUserPayments(userId));
    }

    @GetMapping("/builder/{builderId}")
    public ResponseEntity<?> getBuilderPayments(@PathVariable Long builderId) {
        return ResponseEntity.ok(paymentService.getBuilderPayments(builderId));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/check-booking")
    public ResponseEntity<?> checkBookingStatus(@RequestParam Long userId, @RequestParam Long propertyId) {
        boolean isBooked = paymentService.hasUserBookedProperty(userId, propertyId);
        return ResponseEntity.ok(Map.of("isBooked", isBooked));
    }
}
