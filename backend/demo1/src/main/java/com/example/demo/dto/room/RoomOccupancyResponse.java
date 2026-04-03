package com.example.demo.dto.room;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomOccupancyResponse {
    UUID roomId;
    String roomName;
    int capacity;
    int bookedCount;
}
