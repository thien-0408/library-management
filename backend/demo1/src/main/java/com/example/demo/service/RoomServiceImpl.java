package com.example.demo.service;

import com.example.demo.dto.room.RoomRequest;
import com.example.demo.dto.room.RoomResponse;
import com.example.demo.entity.Room;
import com.example.demo.enums.ErrorCode;
import com.example.demo.exception.AppException;
import com.example.demo.mapper.RoomMapper;
import com.example.demo.repository.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
@Service
@AllArgsConstructor
public class RoomServiceImpl implements RoomService {

    private RoomRepository roomRepository;
    private RoomMapper roomMapper;
    
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
        room.setNumberOfSeats(roomRequest.getNumberOfSeats());
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
}
