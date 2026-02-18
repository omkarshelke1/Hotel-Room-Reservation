package com.hotel.dto;
import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingRequestDTO {
    private Long userId; // Changed from customerId
    private Long roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
}