package com.example.demo.dto.roomReservation;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants(level = AccessLevel.PRIVATE)
public class RoomReservationResponse {
    UUID id;
    UUID roomId;
    UUID userId;
    UUID timeSlotId;
    LocalDate bookingDate;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
