package com.example.demo.service;

import com.example.demo.dto.room.RoomRequest;
import com.example.demo.dto.room.RoomResponse;

import java.util.List;
import java.util.UUID;

public interface RoomService {
    RoomResponse createRoom(RoomRequest roomRequest);
    RoomResponse editRoom(UUID roomId, RoomRequest roomRequest);
    void deleteRoom(UUID roomId);
    List<RoomResponse> getAllRooms();
}
