package com.hotel.service;
import com.hotel.entities.Hotel;
import com.hotel.entities.Room;

import java.time.LocalDate;
import java.util.List;

public interface HotelService {
    // Hotel CRUD
    Hotel addHotel(Hotel hotel);
    Hotel getHotel(Long id);
    Hotel updateHotel(Long id, Hotel hotelDetails); // UPDATE
    void deleteHotel(Long id);                      // DELETE
    List<Hotel> getAllHotels();

    // Room CRUD
    Room addRoom(Long hotelId, Room room);
    Room updateRoom(Long roomId, Room roomDetails); // UPDATE
    void deleteRoom(Long roomId);                   // DELETE
    List<Room> getRoomsByHotel(Long hotelId);
    List<Room> getAvailableRooms(Long hotelId, LocalDate checkIn, LocalDate checkOut);
}