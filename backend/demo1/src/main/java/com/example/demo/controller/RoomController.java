package com.example.demo.controller;

import com.example.demo.dto.room.RoomRequest;
import com.example.demo.dto.room.RoomResponse;
import com.example.demo.entity.ApiResponse;
import com.example.demo.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;

    @GetMapping("")
    public ApiResponse<List<RoomResponse>> getAllRooms()
    {
        List<RoomResponse> result = roomService.getAllRooms();
        return ApiResponse.<List<RoomResponse>>builder().message("Get rooms successfully").result(result).build();
    }
    @PatchMapping("/{roomId}")
    public ApiResponse<RoomResponse> updateRoom(@PathVariable UUID roomId, @RequestBody RoomRequest roomRequest)
    {
        RoomResponse result = roomService.editRoom(roomId, roomRequest);
        return ApiResponse.<RoomResponse>builder().message("Update room successfully").result(result).build();
    }
    @DeleteMapping("/{roomId}")
    public ApiResponse<Void> deleteRoom(@PathVariable UUID roomId)
    {
        roomService.deleteRoom(roomId);
        return ApiResponse.<Void>builder().message("Delete room successfully").result(null).build();
    }
    @PostMapping("")
    public ApiResponse<RoomResponse> createRoom(@RequestBody RoomRequest roomRequest)
    {
        RoomResponse result = roomService.createRoom(roomRequest);
        return ApiResponse.<RoomResponse>builder().message("Create room successfully").result(result).build();
    }
}
