package com.example.demo.dto.room;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomAvailabilityResponse {
    UUID id;
    String name;
    String description;
    int capacity;
    int seatsLeft;
    boolean isFull;
}
