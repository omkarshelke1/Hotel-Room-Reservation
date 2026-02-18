package com.hotel.payment.dto;

import com.hotel.payment.entities.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long paymentId;
    private Long bookingId;
    private Double amount;
    private String currency;
    private PaymentStatus status;
    private String razorpayPaymentId;
    private String message;
}
