package com.example.demo.dto.roomReservation;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;

import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants(level = AccessLevel.PRIVATE)
public class RoomReservationUpdateRequest {
    @NotNull(message = "Booking date can not be null")
    @FutureOrPresent(message = "You can not choose the past, it needs to be present or future")
    LocalDate bookingDate;

    @NotNull(message = "Room ID can not be null")
    UUID roomId;

    @NotNull(message = "Time slot ID can not be null")
    UUID timeSlotId;
}