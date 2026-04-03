package com.example.demo.controller;

import com.example.demo.dto.timeSlot.TimeSlotRequest;
import com.example.demo.dto.timeSlot.TimeSlotResponse;
import com.example.demo.entity.ApiResponse;
import com.example.demo.service.TimeSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/time-slots")
@RequiredArgsConstructor
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    // API này để cho Front-end lấy các khung thời gian đã được khởi tạo
    // Nó được sort theo thứ tự tăng dần nhé
    // Output: timeSlotId, startTime, endTime,...
    @GetMapping("")
    public ApiResponse<List<TimeSlotResponse>> getAllTimeSlots() {
        List<TimeSlotResponse> result = timeSlotService.getAllTimeSlotsASC();
        return ApiResponse.<List<TimeSlotResponse>>builder()
                .message("Get all time slots successfully")
                .result(result)
                .build();
    }

    // Admin CRUD
    @PostMapping("")
    public ApiResponse<TimeSlotResponse> createTimeSlot(@RequestBody TimeSlotRequest request) {
        TimeSlotResponse result = timeSlotService.createTimeSlot(request);
        return ApiResponse.<TimeSlotResponse>builder()
                .message("Create time slot successfully")
                .result(result)
                .build();
    }

    // Admin CRUD
    @PatchMapping("/{id}")
    public ApiResponse<TimeSlotResponse> editTimeSlot(@PathVariable UUID id, @RequestBody TimeSlotRequest request) {
        TimeSlotResponse result = timeSlotService.editTimeSlot(id, request);
        return ApiResponse.<TimeSlotResponse>builder()
                .message("Update time slot successfully")
                .result(result)
                .build();
    }

    // Admin CRUD
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteTimeSlot(@PathVariable UUID id) {
        timeSlotService.deleteTimeSlot(id);
        return ApiResponse.<Void>builder()
                .message("Delete time slot successfully")
                .result(null)
                .build();
    }
}
