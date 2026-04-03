package com.example.demo.service;

import com.example.demo.dto.room.RoomAvailabilityResponse;
import com.example.demo.dto.room.RoomOccupancyResponse;
import com.example.demo.dto.room.RoomRequest;
import com.example.demo.dto.room.RoomResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface RoomService {
    RoomResponse createRoom(RoomRequest roomRequest);
    RoomResponse editRoom(UUID roomId, RoomRequest roomRequest);
    void deleteRoom(UUID roomId);
    List<RoomResponse> getAllRooms();
    List<RoomAvailabilityResponse> getAvailablbilityRooms(LocalDate date, UUID timeSlotId);
    List<RoomOccupancyResponse> getRoomOccupancy(LocalDate date, UUID timeSlotId);
}
