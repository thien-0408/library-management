package com.example.demo.mapper;

import com.example.demo.dto.room.RoomAvailabilityResponse;
import com.example.demo.dto.room.RoomOccupancyResponse;
import com.example.demo.dto.room.RoomRequest;
import com.example.demo.dto.room.RoomResponse;
import com.example.demo.entity.Room;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    Room toRoom(RoomRequest roomRequest);
    RoomResponse toRoomResponse(Room room);
    List<RoomResponse> toListResponse(List<Room> rooms);
    @Mapping(target = "seatsLeft", expression = "java(Math.max(0, room.getCapacity() - bookedCount))")
    @Mapping(target = "isFull", expression = "java(room.getCapacity() - bookedCount <= 0)")
    RoomAvailabilityResponse toAvailabilityResponse(Room room, int bookedCount);
    @Mapping(source = "room.id", target = "roomId")
    @Mapping(source = "room.name", target = "roomName")
    @Mapping(source = "room.capacity", target = "capacity")
    @Mapping(source = "bookedCount", target = "bookedCount")
    RoomOccupancyResponse toOccupancyResponse(Room room, int bookedCount);
}
