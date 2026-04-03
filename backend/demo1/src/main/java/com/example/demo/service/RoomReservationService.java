package com.example.demo.service;

import com.example.demo.dto.roomReservation.RoomReservationCreationRequest;
import com.example.demo.dto.roomReservation.RoomReservationResponse;
import com.example.demo.dto.roomReservation.RoomReservationUpdateRequest;
import com.example.demo.dto.roomReservation.UpcomingReservationResponse;

import java.util.List;
import java.util.UUID;

public interface RoomReservationService {
    RoomReservationResponse createRoomReservation(RoomReservationCreationRequest roomReservationRequest);
    RoomReservationResponse editRoomReservation(UUID roomReservationId, RoomReservationUpdateRequest roomReservationUpdateRequest);
    void deleteRoomReservation(UUID roomReservationId);
    List<RoomReservationResponse> getAllRoomReservations();
    UpcomingReservationResponse getClosestUpcomingReservation(UUID userId);
    void confirmReservation(UUID reservationId);
    void cancelReservation(UUID reservationId);
}
