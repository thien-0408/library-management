package com.example.demo.service;

import com.example.demo.dto.roomReservation.RoomReservationCreationRequest;
import com.example.demo.dto.roomReservation.RoomReservationResponse;
import com.example.demo.dto.roomReservation.RoomReservationUpdateRequest;
import com.example.demo.dto.roomReservation.UpcomingReservationResponse;
import com.example.demo.entity.Room;
import com.example.demo.entity.RoomReservation;
import com.example.demo.entity.TimeSlot;
import com.example.demo.entity.User;
import com.example.demo.enums.ErrorCode;
import com.example.demo.enums.ReservationStatus;
import com.example.demo.exception.AppException;
import com.example.demo.mapper.RoomReservationMapper;
import com.example.demo.repository.RoomRepository;
import com.example.demo.repository.RoomReservationRepository;
import com.example.demo.repository.TimeSlotRepository;
import com.example.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomReservationServiceImpl implements RoomReservationService {

    private final RoomReservationRepository roomReservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final RoomReservationMapper roomReservationMapper;

    @Override
    @Transactional
    public RoomReservationResponse createRoomReservation(RoomReservationCreationRequest roomReservationRequest) {
        Room room = roomRepository.findById(roomReservationRequest.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        User user = userRepository.findById(roomReservationRequest.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        TimeSlot timeSlot = timeSlotRepository.findById(roomReservationRequest.getTimeSlotId())
                .orElseThrow(() -> new AppException(ErrorCode.TIME_SLOT_NOT_FOUND));
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        if (roomReservationRequest.getBookingDate().isBefore(today)) {
            throw new AppException(ErrorCode.INVALID_BOOKING_DATE);
        }
        if (roomReservationRequest.getBookingDate().equals(today) &&
                !timeSlot.getStartTime().isAfter(now)) {
            throw new AppException(ErrorCode.INVALID_BOOKING_TIME);
        }
        if (roomReservationRepository.existsBySlotAndDateAndUser(
                timeSlot.getId(), roomReservationRequest.getBookingDate(), user.getId())) {
            throw new AppException(ErrorCode.USER_ALREADY_BOOKED);
        }
        List<ReservationStatus> activeStatuses = List.of(ReservationStatus.SCHEDULING);
        int currentBooked = roomReservationRepository.countOccupancy(
                room.getId(), timeSlot.getId(), roomReservationRequest.getBookingDate(), activeStatuses);
        if (currentBooked >= room.getCapacity()) {
            throw new AppException(ErrorCode.ROOM_FULL);
        }
        RoomReservation reservation = roomReservationMapper.toRoomReservation(roomReservationRequest);
        reservation.setRoom(room);
        reservation.setUser(user);
        reservation.setTimeSlot(timeSlot);
        reservation.setReservationStatus(ReservationStatus.SCHEDULING);
        RoomReservation savedReservation = roomReservationRepository.save(reservation);
        return roomReservationMapper.toRoomReservationResponse(savedReservation);
    }

    @Override
    @Transactional
    public RoomReservationResponse editRoomReservation(UUID roomReservationId, RoomReservationUpdateRequest request) {
        RoomReservation existing = roomReservationRepository.findById(roomReservationId).orElseThrow(() -> new AppException(ErrorCode.ROOM_RESERVATION_NOT_FOUND));
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        if (request.getBookingDate().isBefore(today)) {
            throw new AppException(ErrorCode.INVALID_BOOKING_DATE);
        }
        Room room = roomRepository.findById(request.getRoomId()).orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        TimeSlot timeSlot = timeSlotRepository.findById(request.getTimeSlotId()).orElseThrow(() -> new AppException(ErrorCode.TIME_SLOT_NOT_FOUND));
        if (request.getBookingDate().equals(today) && !timeSlot.getStartTime().isAfter(now)) {
            throw new AppException(ErrorCode.INVALID_BOOKING_TIME);
        }
        if (roomReservationRepository.existsBySlotAndDateAndUserAndIdNot(
                timeSlot.getId(), request.getBookingDate(), existing.getUser().getId(), roomReservationId)) {
            throw new AppException(ErrorCode.USER_ALREADY_BOOKED);
        }
        List<ReservationStatus> activeStatuses = List.of(ReservationStatus.SCHEDULING, ReservationStatus.CONFIRMED);
        int currentBooked = roomReservationRepository.countOccupancyAndIdNot(
                room.getId(), timeSlot.getId(), request.getBookingDate(), activeStatuses, roomReservationId);
        if (currentBooked >= room.getCapacity()) {
            throw new AppException(ErrorCode.ROOM_FULL);
        }
        existing.setBookingDate(request.getBookingDate());
        existing.setRoom(room);
        existing.setTimeSlot(timeSlot);
        RoomReservation updated = roomReservationRepository.save(existing);
        return roomReservationMapper.toRoomReservationResponse(updated);
    }

    @Override
    @Transactional
    public void deleteRoomReservation(UUID roomReservationId) {
        if (!roomReservationRepository.existsById(roomReservationId)) {
            throw new AppException(ErrorCode.ROOM_RESERVATION_NOT_FOUND); 
        }
        roomReservationRepository.deleteById(roomReservationId);
    }

    @Override
    public List<RoomReservationResponse> getAllRoomReservations() {
        return roomReservationMapper.toRoomReservationList(roomReservationRepository.findAllSorted());
    }

    @Override
    public UpcomingReservationResponse getClosestUpcomingReservation(UUID userId) {
        RoomReservation reservation = roomReservationRepository.findUpcomingReservations(userId, ReservationStatus.SCHEDULING, LocalDate.now(), PageRequest.of(0, 1)).stream().findFirst().orElse(null);
        if (reservation == null) {
            return null;
        }
        return roomReservationMapper.toUpcomingResponse(reservation);
    }

    @Override
    @Transactional
    public void confirmReservation(UUID reservationId) {
        RoomReservation reservation = roomReservationRepository.findById(reservationId).orElseThrow(() -> new AppException(ErrorCode.ROOM_RESERVATION_NOT_FOUND));
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        LocalTime startTime = reservation.getTimeSlot().getStartTime();
        if (reservation.getReservationStatus() != ReservationStatus.SCHEDULING || !reservation.getBookingDate().equals(today) || now.isBefore(startTime) || now.isAfter(startTime.plusMinutes(10))) {
            throw new AppException(ErrorCode.CANNOT_CONFIRM_OUTSIDE_TIME);
        }
        reservation.setReservationStatus(ReservationStatus.CONFIRMED);
        roomReservationRepository.save(reservation);
    }

    @Override
    @Transactional
    public void cancelReservation(UUID reservationId) {
        RoomReservation reservation = roomReservationRepository.findById(reservationId).orElseThrow(() -> new AppException(ErrorCode.ROOM_RESERVATION_NOT_FOUND));
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        LocalTime startTime = reservation.getTimeSlot().getStartTime();
        if (reservation.getBookingDate().isBefore(today) || (reservation.getBookingDate().equals(today) && !now.isBefore(startTime))) {
            throw new AppException(ErrorCode.CANNOT_CANCEL_AFTER_START);
        }
        reservation.setReservationStatus(ReservationStatus.CANCELLED);
        roomReservationRepository.save(reservation);
    }
}
