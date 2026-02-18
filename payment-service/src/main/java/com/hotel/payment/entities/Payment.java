package com.hotel.payment.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @Column(nullable = false)
    private Long bookingId; // Reference to booking in hotel_backend

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String currency = "INR";

    // Razorpay order details
    @Column(unique = true)
    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private String receipt;

    @Column(length = 500)
    private String errorMessage;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime completedAt;

    @Column(length = 1000)
    private String metadata; // JSON string for additional data
}
