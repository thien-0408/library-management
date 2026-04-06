package com.example.demo.mapper;

import com.example.demo.dto.roomReservation.RoomReservationCreationRequest;
import com.example.demo.dto.roomReservation.RoomReservationResponse;
import com.example.demo.dto.roomReservation.UpcomingReservationResponse;
import com.example.demo.entity.RoomReservation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoomReservationMapper {
    RoomReservation toRoomReservation(RoomReservationCreationRequest roomReservationRequest);
    @Mapping(source = "room.id", target = "roomId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "timeSlot.id", target = "timeSlotId")
    RoomReservationResponse toRoomReservationResponse (RoomReservation roomReservation);
    List<RoomReservationResponse> toRoomReservationList(List<RoomReservation> roomReservations);
    @Mapping(source = "room.name", target = "roomName")
    @Mapping(source = "room.description", target = "roomDescription")
    @Mapping(source = "timeSlot.startTime", target = "startTime")
    @Mapping(source = "timeSlot.endTime", target = "endTime")
    UpcomingReservationResponse toUpcomingResponse(RoomReservation reservation);
}
