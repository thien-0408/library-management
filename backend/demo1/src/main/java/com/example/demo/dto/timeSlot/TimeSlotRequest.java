package com.example.demo.dto.timeSlot;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldNameConstants;

import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldNameConstants(level = AccessLevel.PRIVATE)
public class TimeSlotRequest {
    @NotNull(message = "Start time can not be null")
    LocalTime startTime;
    @NotNull(message = "End time can not be null")
    LocalTime endTime;
}
