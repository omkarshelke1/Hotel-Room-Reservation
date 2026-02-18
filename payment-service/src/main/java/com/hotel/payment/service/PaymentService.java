package com.hotel.payment.service;

import com.hotel.payment.dto.*;
import com.hotel.payment.entities.Payment;
import org.json.JSONObject;

import java.util.List;

public interface PaymentService {
    CreateOrderResponse createOrder(CreateOrderRequest request) throws Exception;

    PaymentResponse verifyPayment(VerifyPaymentRequest request) throws Exception;

    Payment getPaymentById(Long paymentId);

    List<Payment> getPaymentsByBookingId(Long bookingId);

    List<Payment> getPaymentsByUserId(Long userId);

    void handleWebhook(JSONObject payload, String signature) throws Exception;
}
