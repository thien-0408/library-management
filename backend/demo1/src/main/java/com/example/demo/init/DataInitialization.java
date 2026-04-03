package com.example.demo.init;

import com.example.demo.dto.room.RoomRequest;
import com.example.demo.dto.timeSlot.TimeSlotRequest;
import com.example.demo.entity.Room;
import com.example.demo.entity.TimeSlot;
import com.example.demo.entity.User;
import com.example.demo.enums.Role;
import com.example.demo.repository.RoomRepository;
import com.example.demo.repository.TimeSlotRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.RoomService;
import com.example.demo.service.TimeSlotService;
import com.example.demo.service.UserService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.List;

import static java.rmi.server.LogStream.log;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitialization implements CommandLineRunner {
    private final UserService userService;
    private final UserRepository userRepository;
    private final RoomService roomService;
    private final TimeSlotService timeSlotService;
    @Override
    public void run(String... args) throws Exception {
        if(userRepository.count() == 0){
            User admin = new User();
            admin.setRole(Role.ADMIN);
            admin.setUserName("admin");
            admin.setPasswordHash("Admin@123!");
            admin.setUserName("Library Admin");

            userService.addUser(admin);
        }else{
            log("Admin existed");
        }

        if(roomService.getAllRooms().isEmpty()){
            List<RoomRequest> rooms = List.of(
                    new RoomRequest("Room 1", "Room 1", 4),
                    new RoomRequest("Room 2", "Room 2", 4),
                    new RoomRequest("Room 3", "Room 3", 10),
                    new RoomRequest("Room 4", "Room 4", 8),
                    new RoomRequest("Room 5", "Room 5", 4),
                    new RoomRequest("Room 6", "Room 6", 10),
                    new RoomRequest("Room 7", "Room 7", 8),
                    new RoomRequest("Room 8", "Room 8", 4),
                    new RoomRequest("Room 9", "Room 9", 10)
            );
            for(RoomRequest room : rooms){
                roomService.createRoom(room);
            }
        }

        for (int hour = 7; hour < 16; hour++) {
            TimeSlotRequest request = TimeSlotRequest.builder()
                    .startTime(LocalTime.of(hour, 0))
                    .endTime(LocalTime.of(hour + 1, 0))
                    .build();
            timeSlotService.createTimeSlot(request);
        }
    }
}
