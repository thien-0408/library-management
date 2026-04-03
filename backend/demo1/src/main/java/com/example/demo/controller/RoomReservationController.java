package com.example.demo.controller;

import com.example.demo.dto.roomReservation.RoomReservationCreationRequest;
import com.example.demo.dto.roomReservation.RoomReservationResponse;
import com.example.demo.dto.roomReservation.RoomReservationUpdateRequest;
import com.example.demo.dto.roomReservation.UpcomingReservationResponse;
import com.example.demo.entity.ApiResponse;
import com.example.demo.service.RoomReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/room-reservations")
@RequiredArgsConstructor
public class RoomReservationController {

    private final RoomReservationService roomReservationService;

    // API này để book room nhé
    // Input: roomId, timeSlotId, userId, ngày muốn book
    // Output
    @PostMapping("")
    public ApiResponse<RoomReservationResponse> createRoomReservation(@RequestBody RoomReservationCreationRequest request) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        request.setUserId(UUID.fromString(currentUserId));
        RoomReservationResponse result = roomReservationService.createRoomReservation(request);
        return ApiResponse.<RoomReservationResponse>builder()
                .message("Create room reservation successfully")
                .result(result)
                .build();
    }

    // Như trong UI chỗ upcomming tôi thấy nó hiện có 1 cái
    // Nên API này sẽ lấy cái RoomReservation gần nhất
    @GetMapping("/upcoming")
    public ApiResponse<UpcomingReservationResponse> getUpcomingReservation() {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        UpcomingReservationResponse result = roomReservationService.getClosestUpcomingReservation(UUID.fromString(currentUserId));
        return ApiResponse.<UpcomingReservationResponse>builder()
                .message("Get upcoming reservation successfully")
                .result(result)
                .build();
    }

    // Này để user confirm là có sử dụng phòng, nên sẽ được dùng để update status cho room reservation nhé.
    // Và user chỉ confirm được nếu time.now  == start time nên nếu được ông có thể không cho active nút confirm nếu chưa đến giờ nhé.
    @PatchMapping("/{id}/confirm")
    public ApiResponse<Void> confirmReservation(@PathVariable UUID id) {
        roomReservationService.confirmReservation(id);
        return ApiResponse.<Void>builder()
                .message("Confirm reservation successfully")
                .result(null)
                .build();
    }
    // Này để user hủy book, nhưng chỉ được hủy trước start time nhé, nếu đến start time
    // thì ông có thể chuyển nút cancelled thành confirmed cũng dược
    // không thì ko cho active nut cancelled và reactive confirmed
    @PatchMapping("/{id}/cancel")
    public ApiResponse<Void> cancelReservation(@PathVariable UUID id) {
        roomReservationService.cancelReservation(id);
        return ApiResponse.<Void>builder()
                .message("Cancel reservation successfully")
                .result(null)
                .build();
    }
    // user modify
    @PutMapping("/{id}")
    public ApiResponse<RoomReservationResponse> editRoomReservation(@PathVariable UUID id, @RequestBody RoomReservationUpdateRequest request) {
        RoomReservationResponse result = roomReservationService.editRoomReservation(id, request);
        return ApiResponse.<RoomReservationResponse>builder()
                .message("Edit room reservation successfully")
                .result(result)
                .build();
    }

    // Admin CRUD
    @GetMapping("")
    public ApiResponse<List<RoomReservationResponse>> getAllRoomReservations() {
        List<RoomReservationResponse> result = roomReservationService.getAllRoomReservations();
        return ApiResponse.<List<RoomReservationResponse>>builder()
                .message("Get all reservations successfully")
                .result(result)
                .build();
    }

    // Admin CRUD
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteRoomReservation(@PathVariable UUID id) {
        roomReservationService.deleteRoomReservation(id);
        return ApiResponse.<Void>builder()
                .message("Delete reservation successfully")
                .result(null)
                .build();
    }
}
