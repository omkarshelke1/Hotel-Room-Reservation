package com.hotel.service;

import com.hotel.dto.BookingRequestDTO;
import com.hotel.entities.*;
import com.hotel.repository.*;
import com.hotel.custom_exceptions.ResourceNotFoundException;
import com.hotel.custom_exceptions.RoomNotAvailableException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private UserRepository userRepo; // Use UserRepository now
    @Autowired
    private RoomRepository roomRepo;
    @Autowired
    private BookingRepository bookingRepo;

    @Override
    public Booking bookRoom(BookingRequestDTO request) {
        // 1. Find User (was Customer)
        User user = userRepo.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));

        // 2. Find Room
        Room room = roomRepo.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + request.getRoomId()));

        // 3. Check Availability
        if (!room.getIsAvailable()) {
            throw new RoomNotAvailableException(
                    "This room is already booked. Please select a different room or check availability for other dates.");
        }

        // 4. Create Booking
        Booking booking = new Booking();
        booking.setUser(user); // Updated from setCustomer to setUser
        booking.setRoom(room);
        booking.setBookingDate(LocalDate.now());
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setTotalAmount(room.getRoomPrice());

        // 5. Update room status
        room.setIsAvailable(false);
        roomRepo.save(room);

        return bookingRepo.save(booking);
    }

    @Override
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepo.findByUser_Id(userId);
    }

    // NEW: Get ALL bookings (for Admin)
    @Override
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }
}