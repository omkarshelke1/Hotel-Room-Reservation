package com.hotel.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrderResponse {
    private Long paymentId;
    private String razorpayOrderId;
    private Double amount;
    private String currency;
    private String razorpayKeyId;
}
