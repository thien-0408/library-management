package com.example.demo.dto.room;

import com.example.demo.enums.BookingStatus;
import com.example.demo.enums.StateViewerStatus;
import com.example.demo.enums.StatusViewerMessage;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomResponse {
    UUID id;
    String name;
    String description;
    int numberOfSeats;
    BookingStatus bookingStatus;
    StateViewerStatus stateViewerStatus;
    StatusViewerMessage statusViewerMessage;
}
