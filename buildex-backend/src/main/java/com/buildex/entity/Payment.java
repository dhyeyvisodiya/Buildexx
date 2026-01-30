package com.buildex.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data; // Restored
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "razorpay_order_id")
    private String razorpayOrderId;

    @Column(name = "razorpay_payment_id")
    private String razorpayPaymentId;

    @Column(name = "razorpay_signature")
    private String razorpaySignature;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @ManyToOne
    @JoinColumn(name = "builder_id")
    private User builder; // Builder is now a User with role='builder'

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PaymentStatus status;

    @Column(name = "amount")
    private BigDecimal amount; // The amount paid in this transaction (Booking Amount)

    @Column(name = "total_amount")
    private BigDecimal totalAmount; // The total price/rent of the property

    @Column(name = "remaining_amount")
    private BigDecimal remainingAmount; // Calculated as Total - Booking

    @Column(name = "payment_type")
    @Enumerated(EnumType.STRING)
    private PaymentType paymentType; // BUY, RENT (from Property Purpose)

    @Column(name = "currency")
    private String currency = "INR";

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum PaymentStatus {
        PENDING, SUCCESS, FAILED, REFUNDED
    }

    public enum PaymentType {
        BUY, RENT
    }
}
