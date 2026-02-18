package com.hotel.payment.repository;

import com.hotel.payment.entities.Payment;
import com.hotel.payment.entities.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);

    List<Payment> findByBookingId(Long bookingId);

    List<Payment> findByUserId(Long userId);

    List<Payment> findByStatus(PaymentStatus status);
}
