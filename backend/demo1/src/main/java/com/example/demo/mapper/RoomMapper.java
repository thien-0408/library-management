package com.example.demo.mapper;

import com.example.demo.dto.room.RoomRequest;
import com.example.demo.dto.room.RoomResponse;
import com.example.demo.entity.Room;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    @Mapping(target = "bookingStatus", constant = "AVAILABLE")
    @Mapping(target = "stateViewerStatus", constant = "LIGHT")
    @Mapping(target = "statusViewerMessage", constant = "EMPTY")
    Room toRoom(RoomRequest roomRequest);
    RoomResponse toRoomResponse(Room room);
    List<RoomResponse> toListResponse(List<Room> rooms);
}
