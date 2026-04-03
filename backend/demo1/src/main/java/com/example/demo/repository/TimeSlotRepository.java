package com.example.demo.repository;

import com.example.demo.entity.TimeSlot;
import org.springframework.data.repository.CrudRepository;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public interface TimeSlotRepository extends CrudRepository<TimeSlot, UUID> {
    boolean existsTimeSlotByStartTime(LocalTime startTime);
    boolean existsTimeSlotByEndTime(LocalTime endTime);
    boolean existsTimeSlotByStartTimeAndIdNot(LocalTime startTime,UUID timeSlotId);
    boolean existsTimeSlotByEndTimeAndIdNot(LocalTime endTime,UUID timeSlotId);
    List<TimeSlot> findAllByOrderByStartTimeAsc();
}
