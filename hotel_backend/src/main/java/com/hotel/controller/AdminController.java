package com.hotel.controller;

import com.hotel.entities.Booking;
import com.hotel.entities.Hotel;
import com.hotel.entities.Room;
import com.hotel.service.BookingService;
import com.hotel.service.HotelService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired private HotelService hotelService;
    @Autowired private BookingService bookingService;

    // --- HOTEL ENDPOINTS ---

    @PostMapping("/add-hotel")
    public ResponseEntity<Hotel> addHotel(@RequestBody Hotel hotel) {
        return ResponseEntity.ok(hotelService.addHotel(hotel));
    }
    
    @GetMapping("/all-bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // FIX: Added ("id") inside @PathVariable
    @PutMapping("/update-hotel/{id}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable("id") Long id, @RequestBody Hotel hotel) {
        return ResponseEntity.ok(hotelService.updateHotel(id, hotel));
    }

    // FIX: Added ("id") inside @PathVariable
    @DeleteMapping("/delete-hotel/{id}")
    public ResponseEntity<String> deleteHotel(@PathVariable("id") Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.ok("Hotel deleted successfully");
    }

    // --- ROOM ENDPOINTS ---

    // FIX: Added ("hotelId") inside @PathVariable
    @PostMapping("/hotel/{hotelId}/add-room")
    public ResponseEntity<Room> addRoom(@PathVariable("hotelId") Long hotelId, @RequestBody Room room) {
        return ResponseEntity.ok(hotelService.addRoom(hotelId, room));
    }

    // FIX: Added ("roomId") inside @PathVariable
    @PutMapping("/update-room/{roomId}")
    public ResponseEntity<Room> updateRoom(@PathVariable("roomId") Long roomId, @RequestBody Room room) {
        return ResponseEntity.ok(hotelService.updateRoom(roomId, room));
    }

    // FIX: Added ("roomId") inside @PathVariable
    @DeleteMapping("/delete-room/{roomId}")
    public ResponseEntity<String> deleteRoom(@PathVariable("roomId") Long roomId) {
        hotelService.deleteRoom(roomId);
        return ResponseEntity.ok("Room deleted successfully");
    }
}