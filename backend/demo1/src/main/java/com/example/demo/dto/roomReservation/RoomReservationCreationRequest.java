package com.example.demo.dto.roomReservation;

import jakarta.persistence.Column;
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
public class RoomReservationCreationRequest {
    @NotNull(message = "Booking date can not be null")
    @FutureOrPresent(message = "You can not choose the past, it needs to be present or future")
    LocalDate bookingDate;
    @NotNull
    UUID roomId;
    @NotNull
    UUID userId;
    @NotNull
    UUID timeSlotId;
}
