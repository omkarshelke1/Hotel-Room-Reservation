package com.hotel.payment.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
public class CreateOrderRequest {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    private String currency = "INR";

    private String receipt;
}
