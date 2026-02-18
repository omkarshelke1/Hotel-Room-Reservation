package com.hotel.payment.controller;

import com.hotel.payment.dto.*;
import com.hotel.payment.entities.Payment;
import com.hotel.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        try {
            log.info("Received create order request for booking: {}", request.getBookingId());
            CreateOrderResponse response = paymentService.createOrder(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error creating order", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error creating payment order: " + e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@Valid @RequestBody VerifyPaymentRequest request) {
        try {
            log.info("Received payment verification request for order: {}", request.getRazorpayOrderId());
            PaymentResponse response = paymentService.verifyPayment(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error verifying payment", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Payment verification failed: " + e.getMessage()));
        }
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<?> getPayment(@PathVariable Long paymentId) {
        try {
            Payment payment = paymentService.getPaymentById(paymentId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            log.error("Error fetching payment", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Payment not found: " + e.getMessage()));
        }
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<Payment>> getPaymentsByBooking(@PathVariable Long bookingId) {
        log.info("Fetching payments for booking: {}", bookingId);
        List<Payment> payments = paymentService.getPaymentsByBookingId(bookingId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>> getPaymentsByUser(@PathVariable Long userId) {
        log.info("Fetching payments for user: {}", userId);
        List<Payment> payments = paymentService.getPaymentsByUserId(userId);
        return ResponseEntity.ok(payments);
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {
        try {
            log.info("Received webhook from Razorpay");
            JSONObject jsonPayload = new JSONObject(payload);
            paymentService.handleWebhook(jsonPayload, signature);
            return ResponseEntity.ok("Webhook processed");
        } catch (Exception e) {
            log.error("Webhook processing error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Webhook processing failed");
        }
    }

    // Error response class
    private record ErrorResponse(String message) {
    }
}
