package com.example.demo.controller;

import com.example.demo.dto.room.RoomAvailabilityResponse;
import com.example.demo.dto.room.RoomOccupancyResponse;
import com.example.demo.dto.room.RoomRequest;
import com.example.demo.dto.room.RoomResponse;
import com.example.demo.entity.ApiResponse;
import com.example.demo.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;
    // Admin CRUD
    @GetMapping("")
    public ApiResponse<List<RoomResponse>> getAllRooms()
    {
        List<RoomResponse> result = roomService.getAllRooms();
        return ApiResponse.<List<RoomResponse>>builder()
                        .message("Get rooms successfully")
                        .result(result).build();
    }
    // API này để lấy các info của các room dựa theo ngày, và khung giờ mà user muốn xem để book
    // Match với UI ở 1. Select Room
    // Input là Ngày, khung thời gian
    // Output là roomId, roomName, roomDesciption, roomCapacity, seatsLeft, isFull
    // Phía UI sẽ dựa vô isFull để quyết định xem nên hiện thị chữ Full, hay seatsLeft như ở UI nhé
    @GetMapping("/availability-room")
    public ApiResponse<List<RoomAvailabilityResponse>> getAvailablbilityRooms(@RequestParam("date") LocalDate date,
                                                                         @RequestParam("timeSlotId") UUID timeSlotId) {
        List<RoomAvailabilityResponse> result = roomService.getAvailablbilityRooms(date, timeSlotId);
        return ApiResponse.<List<RoomAvailabilityResponse>>builder()
                .message("Get available rooms successfully")
                .result(result)
                .build();
    }

    // Admin Dashboard
    // API này match với UI Room State Viewer
    // Input: Ngày và Khung giờ mà admin muốn xem
    // Output: roomId, roomName, capacity, bookedCount
    // Nếu muốn thiết kế UI giống thì có thể tính tỷ lệ giữa capacity với bookedCount để xét LIGHT // MODERATE // BUSY nhé.
    @GetMapping("/occupancy-rooms")
    public ApiResponse<List<RoomOccupancyResponse>> getRoomOccupancy(@RequestParam("date") LocalDate date,
                                                                     @RequestParam("timeSlotId") UUID timeSlotId) {
        List<RoomOccupancyResponse> result = roomService.getRoomOccupancy(date, timeSlotId);
        return ApiResponse.<List<RoomOccupancyResponse>>builder()
                .message("Get room occupancy successfully")
                .result(result)
                .build();
    }

    // Admin CRUD
    @PatchMapping("/{id}")
    public ApiResponse<RoomResponse> updateRoom(@PathVariable UUID id, @RequestBody RoomRequest roomRequest)
    {
        RoomResponse result = roomService.editRoom(id, roomRequest);
        return ApiResponse.<RoomResponse>builder().message("Update room successfully").result(result).build();
    }

    // Admin CRUD
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteRoom(@PathVariable UUID id)
    {
        roomService.deleteRoom(id);
        return ApiResponse.<Void>builder().message("Delete room successfully").result(null).build();
    }

    // Admin CRUD
    @PostMapping("")
    public ApiResponse<RoomResponse> createRoom(@RequestBody RoomRequest roomRequest)
    {
        RoomResponse result = roomService.createRoom(roomRequest);
        return ApiResponse.<RoomResponse>builder().message("Create room successfully").result(result).build();
    }
}
