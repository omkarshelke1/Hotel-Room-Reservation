package com.hotel.entities;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore; // Import this!

@Entity
@Data
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;
    private String roomNumber;
    private String roomType;
    private Double roomPrice;
    private Boolean isAvailable;
    private String imageUrl;
    @ManyToOne
    @JoinColumn(name = "hotel_id")
    @JsonIgnore  
    private Hotel hotel;
}