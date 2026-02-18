package com.hotel.repository;

import com.hotel.entities.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    
    // Find rooms in a specific hotel
    List<Room> findByHotel_HotelId(Long hotelId);

    // Advanced: Find rooms that are NOT booked between specific dates
    @Query("SELECT r FROM Room r WHERE r.hotel.hotelId = :hotelId AND r.id NOT IN " +
           "(SELECT b.room.roomId FROM Booking b WHERE " +
           "(b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate))")
    List<Room> findAvailableRooms(@Param("hotelId") Long hotelId, 
                                  @Param("checkInDate") LocalDate checkInDate, 
                                  @Param("checkOutDate") LocalDate checkOutDate);
}