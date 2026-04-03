package com.example.demo.dto.roomReservation;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpcomingReservationResponse {
    String roomName;
    String roomDescription;
    LocalDate bookingDate;
    LocalTime startTime;
    LocalTime endTime;
}
