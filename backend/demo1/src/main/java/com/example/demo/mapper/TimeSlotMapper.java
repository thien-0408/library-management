package com.example.demo.mapper;

import com.example.demo.dto.timeSlot.TimeSlotRequest;
import com.example.demo.dto.timeSlot.TimeSlotResponse;

import com.example.demo.entity.TimeSlot;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TimeSlotMapper {
    TimeSlot toTimeSlot(TimeSlotRequest timeSlotRequest);
    TimeSlotResponse toTimeSlotResponse(TimeSlot timeSlot);
    List<TimeSlotResponse> toTimeSlotList(List<TimeSlot> timeSlots);
}
