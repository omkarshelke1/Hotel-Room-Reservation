package com.hotel;

import com.hotel.entities.*;
import com.hotel.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    private final HotelRepository hotelRepo;
    private final RoomRepository roomRepo;
    private final UserRepository userRepo;

    public DataSeeder( HotelRepository hotelRepo, RoomRepository roomRepo,UserRepository userRepo) {
        this.hotelRepo = hotelRepo;
        this.roomRepo = roomRepo;
		this.userRepo = userRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        if(hotelRepo.count() == 0) {
            // 1. Create Admin
            User admin = new User();
            admin.setName("Super Admin");
            admin.setEmail("admin@test.com");
            admin.setPassword("admin123"); // <--- NEW
            userRepo.save(admin);

            // 2. Create Hotel (Same as before)
            Hotel hotel = new Hotel();
            hotel.setHotelName("Grand Plaza");
            hotel.setLocation("New York");
            hotel.setContact("123-456-7890");
            hotel.setUser(admin);
            hotelRepo.save(hotel);

            // 3. Create Rooms with Images
            Room r1 = new Room();
            r1.setRoomNumber("101");
            r1.setRoomType("Deluxe");
            r1.setRoomPrice(1500.00);
            r1.setIsAvailable(true);
            r1.setImageUrl("https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=500&q=60"); // <--- Nice Bedroom Image
            r1.setHotel(hotel);

            Room r2 = new Room();
            r2.setRoomNumber("102");
            r2.setRoomType("Standard");
            r2.setRoomPrice(800.00);
            r2.setIsAvailable(true);
            r2.setImageUrl("https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=500&q=60"); // <--- Another Image
            r2.setHotel(hotel);
            
            roomRepo.saveAll(Arrays.asList(r1, r2));

            // 4. Create Customer
            User customer = new User();
            customer.setName("John Doe");
            customer.setEmail("john@gmail.com");
            customer.setPassword("password"); // <--- NEW
            userRepo.save(customer);
            
            System.out.println("--- Data Seeding Completed ---");
        }
    }
}