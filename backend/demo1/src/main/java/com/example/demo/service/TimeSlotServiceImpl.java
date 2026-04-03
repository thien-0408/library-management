package com.example.demo.service;

import com.example.demo.dto.timeSlot.TimeSlotRequest;
import com.example.demo.dto.timeSlot.TimeSlotResponse;
import com.example.demo.entity.TimeSlot;
import com.example.demo.enums.ErrorCode;
import com.example.demo.exception.AppException;
import com.example.demo.mapper.TimeSlotMapper;
import com.example.demo.repository.TimeSlotRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TimeSlotServiceImpl implements TimeSlotService {
    private final TimeSlotRepository timeSlotRepository;
    private final TimeSlotMapper timeSlotMapper;
    @Override
    @Transactional
    public TimeSlotResponse createTimeSlot(TimeSlotRequest timeSlotRequest) {
        if(timeSlotRepository.existsTimeSlotByStartTime(timeSlotRequest.getStartTime())){
            throw new AppException(ErrorCode.START_TIME_IS_EXISTED);
        }
        if(timeSlotRepository.existsTimeSlotByEndTime(timeSlotRequest.getEndTime())){
            throw new AppException(ErrorCode.END_TIME_IS_EXISTED);
        }
        TimeSlot timeSlot = timeSlotMapper.toTimeSlot(timeSlotRequest);
        timeSlot = timeSlotRepository.save(timeSlot);
        return timeSlotMapper.toTimeSlotResponse(timeSlot);
    }

    @Override
    @Transactional
    public TimeSlotResponse editTimeSlot(UUID timeSlotId, TimeSlotRequest timeSlotRequest) {
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId).orElseThrow(() -> new AppException(ErrorCode.TIME_SLOT_NOT_FOUND));
        if(timeSlotRepository.existsTimeSlotByStartTimeAndIdNot(timeSlotRequest.getStartTime(), timeSlotId)) {
            throw new AppException(ErrorCode.START_TIME_IS_EXISTED);
        }
        timeSlot.setStartTime(timeSlotRequest.getStartTime());
        if(timeSlotRepository.existsTimeSlotByEndTimeAndIdNot(timeSlotRequest.getEndTime(), timeSlotId)){
            throw new AppException(ErrorCode.END_TIME_IS_EXISTED);
        }
        timeSlot.setEndTime(timeSlotRequest.getEndTime());
        timeSlot = timeSlotRepository.save(timeSlot);
        return timeSlotMapper.toTimeSlotResponse(timeSlot);
    }

    @Override
    @Transactional
    public void deleteTimeSlot(UUID timeSlotId) {
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId).orElseThrow(() -> new AppException(ErrorCode.TIME_SLOT_NOT_FOUND));
        timeSlotRepository.delete(timeSlot);
    }

    @Override
    public List<TimeSlotResponse> getAllTimeSlotsASC() {
        List<TimeSlot> timeSlots = timeSlotRepository.findAllByOrderByStartTimeAsc();
        return timeSlotMapper.toTimeSlotList(timeSlots);
    }
}
