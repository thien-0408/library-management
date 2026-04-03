package com.example.demo.service;

import com.example.demo.dto.timeSlot.TimeSlotRequest;
import com.example.demo.dto.timeSlot.TimeSlotResponse;

import java.util.List;
import java.util.UUID;

public interface TimeSlotService {
    TimeSlotResponse createTimeSlot(TimeSlotRequest timeSlotRequest);
    TimeSlotResponse editTimeSlot(UUID timeSlotId, TimeSlotRequest timeSlotRequest);
    void deleteTimeSlot(UUID timeSlotId);
    List<TimeSlotResponse> getAllTimeSlotsASC();
}
