package com.hotel.service;

import com.hotel.custom_exceptions.ResourceNotFoundException;
import com.hotel.entities.Hotel;
import com.hotel.entities.Room;
import com.hotel.repository.HotelRepository;
import com.hotel.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class HotelServiceImpl implements HotelService {

    @Autowired private HotelRepository hotelRepo;
    @Autowired private RoomRepository roomRepo;

    // --- HOTEL OPERATIONS ---
    @Override
    public List<Room> getAvailableRooms(Long hotelId, LocalDate checkIn, LocalDate checkOut) {
        // Use the custom query we created in Phase 2
        return roomRepo.findAvailableRooms(hotelId, checkIn, checkOut);
    }

    @Override
    public Hotel addHotel(Hotel hotel) {
        return hotelRepo.save(hotel);
    }

    @Override
    public Hotel getHotel(Long id) {
        return hotelRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));
    }

    @Override
    public List<Hotel> getAllHotels() {
        return hotelRepo.findAll();
    }

    @Override
    public Hotel updateHotel(Long id, Hotel hotelDetails) {
        Hotel hotel = getHotel(id); // Reuse getHotel to check existence
        hotel.setHotelName(hotelDetails.getHotelName());
        hotel.setLocation(hotelDetails.getLocation());
        hotel.setContact(hotelDetails.getContact());
        return hotelRepo.save(hotel);
    }

    @Override
    public void deleteHotel(Long id) {
        Hotel hotel = getHotel(id);
        hotelRepo.delete(hotel);
    }

    // --- ROOM OPERATIONS ---

    @Override
    public Room addRoom(Long hotelId, Room room) {
        Hotel hotel = getHotel(hotelId);
        room.setHotel(hotel);
        return roomRepo.save(room);
    }

    @Override
    public Room updateRoom(Long roomId, Room roomDetails) {
        Room room = roomRepo.findById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        
        room.setRoomNumber(roomDetails.getRoomNumber());
        room.setRoomType(roomDetails.getRoomType());
        room.setRoomPrice(roomDetails.getRoomPrice());
        room.setIsAvailable(roomDetails.getIsAvailable());
        
        return roomRepo.save(room);
    }

    @Override
    public void deleteRoom(Long roomId) {
        Room room = roomRepo.findById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        roomRepo.delete(room);
    }

    @Override
    public List<Room> getRoomsByHotel(Long hotelId) {
        return roomRepo.findByHotel_HotelId(hotelId);
    }
}