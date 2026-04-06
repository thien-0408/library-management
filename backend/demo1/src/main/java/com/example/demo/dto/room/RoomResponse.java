package com.example.demo.dto.room;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomResponse {
    UUID id;
    String name;
    String description;
    int capacity;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
