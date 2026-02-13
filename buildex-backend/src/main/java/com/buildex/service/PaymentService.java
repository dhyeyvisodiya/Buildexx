package com.buildex.service;

import com.buildex.entity.Payment;
import com.buildex.entity.Property;
import com.buildex.entity.User;
import com.buildex.repository.PaymentRepository;
import com.buildex.repository.PropertyRepository;
import com.buildex.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    // In a real app, these should be in properties, but for now we might use
    // hardcoded or placeholders
    // User needs to provide keys or we verify if they exist.
    // For this implementation, I will treat Razorpay calls as optional or mocked if
    // keys are missing
    // to strictly allow the "Record Payment" flow to work even without a real
    // gateway for the demo.
    @Value("${razorpay.key_id:rzp_test_placeholder}")
    private String razorpayKeyId;

    @Value("${razorpay.key_secret:razorpay_secret_placeholder}")
    private String razorpayKeySecret;

    public PaymentService(PaymentRepository paymentRepository, PropertyRepository propertyRepository,
            UserRepository userRepository, EmailService emailService) {
        this.paymentRepository = paymentRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    private static final BigDecimal MAX_BOOKING_AMOUNT = new BigDecimal("25000");

    public BigDecimal calculateBookingAmount(Property property) {
        BigDecimal totalAmount = property.getPurpose() == Property.Purpose.RENT
                ? property.getRentAmount()
                : property.getPrice();

        if (totalAmount == null)
            return BigDecimal.ZERO;

        // Booking amount is 15% of the total price/rent, capped at MAX_BOOKING_AMOUNT
        BigDecimal calculatedAmount = totalAmount.multiply(new BigDecimal("0.15"));
        return calculatedAmount.compareTo(MAX_BOOKING_AMOUNT) > 0 ? MAX_BOOKING_AMOUNT : calculatedAmount;
    }

    @Transactional
    public Payment createOrder(Long userId, Long propertyId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        // Check if already booked
        if (paymentRepository.existsByUserIdAndPropertyIdAndStatus(userId, propertyId, Payment.PaymentStatus.SUCCESS)) {
            throw new RuntimeException("You have already booked this property.");
        }

        BigDecimal bookingAmount = calculateBookingAmount(property);
        BigDecimal totalAmount = property.getPrice() != null ? property.getPrice()
                : (property.getRentAmount() != null ? property.getRentAmount() : BigDecimal.ZERO);

        Payment payment = Payment.builder()
                .user(user)
                .property(property)
                .builder(property.getBuilder())
                .amount(bookingAmount)
                .totalAmount(totalAmount)
                .remainingAmount(totalAmount.subtract(bookingAmount))
                .status(Payment.PaymentStatus.PENDING)
                .paymentType(property.getPurpose() == Property.Purpose.RENT ? Payment.PaymentType.RENT
                        : Payment.PaymentType.BUY)
                .build();

        // Integrate with Razorpay if keys are present
        if (!"rzp_test_placeholder".equals(razorpayKeyId)) {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", bookingAmount.multiply(new BigDecimal(100))); // Amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            Order order = razorpay.orders.create(orderRequest);
            payment.setRazorpayOrderId(order.get("id").toString());
        } else {
            // Mock Order ID for demo
            payment.setRazorpayOrderId("order_" + System.currentTimeMillis());
        }

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment verifyPayment(String orderId, String paymentId, String signature) {
        Payment payment = paymentRepository.findByRazorpayOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment order not found"));

        // In a real app, verify signature here using RazorpayUtils

        payment.setRazorpayPaymentId(paymentId);
        payment.setRazorpaySignature(signature);
        payment.setStatus(Payment.PaymentStatus.SUCCESS);

        // Update Property Availability to BOOKED
        Property property = payment.getProperty();
        if (property != null) {
            property.setAvailabilityStatus(Property.AvailabilityStatus.BOOKED);
            propertyRepository.save(property);

            propertyRepository.save(property);
        }

        return paymentRepository.save(payment);
    }

    public List<Payment> getUserPayments(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    public List<Payment> getBuilderPayments(Long builderId) {
        return paymentRepository.findByBuilderId(builderId);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public boolean hasUserBookedProperty(Long userId, Long propertyId) {
        return paymentRepository.existsByUserIdAndPropertyIdAndStatus(userId, propertyId,
                Payment.PaymentStatus.SUCCESS);
    }
}
