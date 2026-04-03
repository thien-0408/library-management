package com.example.demo.service;

import com.example.demo.dto.room.RoomAvailabilityResponse;
import com.example.demo.dto.room.RoomOccupancyResponse;
import com.example.demo.dto.room.RoomRequest;
import com.example.demo.dto.room.RoomResponse;
import com.example.demo.entity.Room;
import com.example.demo.entity.TimeSlot;
import com.example.demo.enums.ErrorCode;
import com.example.demo.enums.ReservationStatus;
import com.example.demo.exception.AppException;
import com.example.demo.mapper.RoomMapper;
import com.example.demo.repository.RoomRepository;
import com.example.demo.repository.RoomReservationRepository;
import com.example.demo.repository.TimeSlotRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;
    private final RoomReservationRepository roomReservationRepository;
    private final TimeSlotRepository timeSlotRepository;
    
    @Override
    @Transactional
    public RoomResponse createRoom(RoomRequest roomRequest) {
        if(roomRepository.existsByName(roomRequest.getName())){
            throw new AppException(ErrorCode.ROOM_NAME_EXISTED);
        }
        Room room = roomMapper.toRoom(roomRequest);
        room = roomRepository.save(room);
        return roomMapper.toRoomResponse(room);
    }

    @Override
    @Transactional
    public RoomResponse editRoom(UUID roomId, RoomRequest roomRequest) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        if(roomRequest.getName() != null){
            if (roomRepository.existsByNameAndIdNot(roomRequest.getName(), roomId)) {
                throw new AppException(ErrorCode.ROOM_NAME_EXISTED);
            }
            room.setName(roomRequest.getName());
        }
        if(roomRequest.getDescription() != null){
            room.setDescription(roomRequest.getDescription());
        }
        room.setCapacity(roomRequest.getCapacity());
        roomRepository.save(room);
        return roomMapper.toRoomResponse(room);
    }

    @Override
    @Transactional
    public void deleteRoom(UUID roomId) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        roomRepository.delete(room);
    }

    @Override
    public List<RoomResponse> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        return roomMapper.toListResponse(rooms);
    }

    @Override
    public List<RoomAvailabilityResponse> getAvailablbilityRooms(LocalDate date, UUID timeSlotId) {
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId).orElseThrow(() -> new AppException(ErrorCode.TIME_SLOT_NOT_FOUND));
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        if (date.isBefore(today)) {
            throw new AppException(ErrorCode.INVALID_BOOKING_DATE);
        }
        if (date.equals(today) && !timeSlot.getStartTime().isAfter(now)) {
            throw new AppException(ErrorCode.INVALID_BOOKING_TIME);
        }
        List<Room> allRooms = roomRepository.findAll();
        List<ReservationStatus> statuses = List.of(ReservationStatus.SCHEDULING);
        List<RoomAvailabilityResponse> responses = new ArrayList<>();
        for (Room room : allRooms) {
            int bookedCount = roomReservationRepository.countOccupancy(room.getId(), timeSlotId, date, statuses);
            responses.add(roomMapper.toAvailabilityResponse(room, bookedCount));
        }
        return responses;
    }

    @Override
    public List<RoomOccupancyResponse> getRoomOccupancy(LocalDate date, UUID timeSlotId) {
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId).orElseThrow(() -> new AppException(ErrorCode.TIME_SLOT_NOT_FOUND));
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        if (date.isBefore(today)) {
            throw new AppException(ErrorCode.INVALID_BOOKING_DATE);
        }
        if (date.equals(today) && timeSlot.getEndTime().isBefore(now)) {
            throw new AppException(ErrorCode.INVALID_BOOKING_TIME);
        }
        List<Room> allRooms = roomRepository.findAll();
        List<ReservationStatus> statuses = List.of(ReservationStatus.SCHEDULING, ReservationStatus.CONFIRMED);
        List<RoomOccupancyResponse> responses = new ArrayList<>();
        for (Room room : allRooms) {
            int bookedCount = roomReservationRepository.countOccupancy(room.getId(), timeSlotId, date, statuses);
            responses.add(roomMapper.toOccupancyResponse(room, bookedCount));
        }
        return responses;
    }
}
