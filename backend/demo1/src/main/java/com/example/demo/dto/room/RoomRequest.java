package com.example.demo.dto.room;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequest {
    @NotNull
    String name;
    String description;
    @Size(min = 0,message = "Number of seats can not be negative")
    int capacity;
}
