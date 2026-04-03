package com.example.demo.dto.timeSlot;

import lombok.*;
import lombok.experimental.FieldNameConstants;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants(level = AccessLevel.PRIVATE)
public class TimeSlotResponse {
    UUID id;
    LocalTime startTime;
    LocalTime endTime;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
