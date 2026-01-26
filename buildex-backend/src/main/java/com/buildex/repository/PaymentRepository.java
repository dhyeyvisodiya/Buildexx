package com.buildex.repository;

import com.buildex.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserId(Long userId);

    List<Payment> findByBuilderId(Long builderId);

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    // Check if a user has already booked a specific property
    // We assume only one successful booking per property per user is relevant for
    // the button disable logic
    boolean existsByUserIdAndPropertyIdAndStatus(Long userId, Long propertyId, Payment.PaymentStatus status);
}
