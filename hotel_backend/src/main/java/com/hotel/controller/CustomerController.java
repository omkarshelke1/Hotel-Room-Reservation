package com.hotel.controller;

import com.hotel.dto.BookingRequestDTO;
import com.hotel.entities.*;
import com.hotel.repository.*; // You can eventually move read-operations to Service too
import com.hotel.service.BookingService;
import com.hotel.service.HotelService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

//    @Autowired private HotelRepository hotelRepo;
//    @Autowired private RoomRepository roomRepo;
    @Autowired private BookingService bookingService;
    @Autowired private HotelService hotelService; // Use Service, not Repo directly

    // Get All Hotels (Still using Repo for simplicity, can move to HotelService)
    @GetMapping("/hotels")
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllHotels());
    }

    // Get Rooms
    @GetMapping("/hotel/{hotelId}/available-rooms")
    public ResponseEntity<List<Room>> getAvailableRooms(
            @PathVariable("hotelId") Long hotelId,
            @RequestParam("checkIn") LocalDate checkIn,
            @RequestParam("checkOut") LocalDate checkOut) {
        
        return ResponseEntity.ok(hotelService.getAvailableRooms(hotelId, checkIn, checkOut));
    }
    
    @GetMapping("/my-bookings/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }
    
    @GetMapping("/hotel/{hotelId}/rooms")
    public ResponseEntity<List<Room>> getRoomsByHotel(@PathVariable("hotelId") Long hotelId) {
        // We can reuse the simple "find by hotel id" logic here
        return ResponseEntity.ok(hotelService.getRoomsByHotel(hotelId));
    }

    // Book Room (Now uses Service + DTO)
    @PostMapping("/book-room")
    public ResponseEntity<Booking> bookRoom(@RequestBody BookingRequestDTO bookingRequest) {
        Booking booking = bookingService.bookRoom(bookingRequest);
        return ResponseEntity.ok(booking);
    }
}