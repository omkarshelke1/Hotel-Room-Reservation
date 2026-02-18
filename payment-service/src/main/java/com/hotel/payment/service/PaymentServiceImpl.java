package com.hotel.payment.service;

import com.hotel.payment.dto.*;
import com.hotel.payment.entities.Payment;
import com.hotel.payment.entities.PaymentStatus;
import com.hotel.payment.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Override
    @Transactional
    public CreateOrderResponse createOrder(CreateOrderRequest request) throws Exception {
        log.info("Creating Razorpay order for booking: {}", request.getBookingId());

        // Create Razorpay order
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", request.getAmount() * 100); // Amount in paise
        orderRequest.put("currency", request.getCurrency());
        orderRequest.put("receipt",
                request.getReceipt() != null ? request.getReceipt() : "booking_" + request.getBookingId());

        Order order = razorpayClient.orders.create(orderRequest);

        // Convert Order to JSONObject to access fields
        JSONObject orderResponse = order.toJson();
        String orderId = orderResponse.getString("id");

        // Save payment record
        Payment payment = new Payment();
        payment.setBookingId(request.getBookingId());
        payment.setUserId(request.getUserId());
        payment.setAmount(request.getAmount());
        payment.setCurrency(request.getCurrency());
        payment.setRazorpayOrderId(orderId);
        payment.setReceipt(orderRequest.getString("receipt"));
        payment.setStatus(PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());

        payment = paymentRepository.save(payment);

        log.info("Razorpay order created: {}", orderId);

        return new CreateOrderResponse(
                payment.getPaymentId(),
                orderId,
                request.getAmount(),
                request.getCurrency(),
                razorpayKeyId);
    }

    @Override
    @Transactional
    public PaymentResponse verifyPayment(VerifyPaymentRequest request) throws Exception {
        log.info("Verifying payment for order: {}", request.getRazorpayOrderId());

        // Find payment record
        Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(
                        () -> new RuntimeException("Payment not found for order: " + request.getRazorpayOrderId()));

        // Verify signature
        String generatedSignature = generateSignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                razorpayKeySecret);

        if (!generatedSignature.equals(request.getRazorpaySignature())) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setErrorMessage("Signature verification failed");
            paymentRepository.save(payment);
            throw new RuntimeException("Payment signature verification failed");
        }

        // Update payment record
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setCompletedAt(LocalDateTime.now());

        payment = paymentRepository.save(payment);

        log.info("Payment verified successfully: {}", request.getRazorpayPaymentId());

        // Create response
        PaymentResponse response = new PaymentResponse();
        response.setPaymentId(payment.getPaymentId());
        response.setBookingId(payment.getBookingId());
        response.setAmount(payment.getAmount());
        response.setCurrency(payment.getCurrency());
        response.setStatus(payment.getStatus());
        response.setRazorpayPaymentId(payment.getRazorpayPaymentId());
        response.setMessage("Payment completed successfully");

        return response;
    }

    private String generateSignature(String orderId, String paymentId, String secret) throws Exception {
        String payload = orderId + "|" + paymentId;
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        byte[] hash = sha256_HMAC.doFinal(payload.getBytes());
        return bytesToHex(hash);
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }

    @Override
    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));
    }

    @Override
    public List<Payment> getPaymentsByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }

    @Override
    public List<Payment> getPaymentsByUserId(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public void handleWebhook(JSONObject payload, String signature) throws Exception {
        log.info("Webhook received: {}", payload.getString("event"));

        String event = payload.getString("event");
        JSONObject paymentEntity = payload.getJSONObject("payload")
                .getJSONObject("payment")
                .getJSONObject("entity");

        String paymentId = paymentEntity.getString("id");

        Payment payment = paymentRepository.findByRazorpayPaymentId(paymentId)
                .orElse(null);

        if (payment != null) {
            switch (event) {
                case "payment.captured":
                    payment.setStatus(PaymentStatus.COMPLETED);
                    log.info("Payment captured: {}", paymentId);
                    break;
                case "payment.failed":
                    payment.setStatus(PaymentStatus.FAILED);
                    payment.setErrorMessage(paymentEntity.optString("error_description"));
                    log.warn("Payment failed: {}", paymentId);
                    break;
                default:
                    log.info("Unhandled webhook event: {}", event);
            }
            paymentRepository.save(payment);
        }
    }
}
