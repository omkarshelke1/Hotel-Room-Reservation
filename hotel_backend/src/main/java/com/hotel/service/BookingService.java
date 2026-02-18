package com.hotel.service;
import java.util.List;

import com.hotel.dto.BookingRequestDTO;
import com.hotel.entities.Booking;

public interface BookingService {
    Booking bookRoom(BookingRequestDTO bookingRequest);
    List<Booking> getUserBookings(Long userId);
    List<Booking> getAllBookings();
}