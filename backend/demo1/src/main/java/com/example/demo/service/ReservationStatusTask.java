package com.example.demo.service;

import com.example.demo.entity.RoomReservation;
import com.example.demo.enums.ReservationStatus;
import com.example.demo.repository.RoomReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReservationStatusTask {

    private final RoomReservationRepository roomReservationRepository;
    @Scheduled(fixedDelay = 60000)
    public void updateReservationStatuses() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        LocalTime allowTime = now.minusMinutes(10);
        log.debug("Starting time {}", now);
        int cancelledCount = roomReservationRepository.bulkUpdateStatusByStartTime(
                ReservationStatus.SCHEDULING, ReservationStatus.CANCELLED, today, allowTime);
        if (cancelledCount > 0) {
            log.info(" Có {} cai bị hủy trong ngày {}", cancelledCount, today);
        }
        int completedCount = roomReservationRepository.bulkUpdateStatusByEndTime(
                ReservationStatus.CONFIRMED, ReservationStatus.COMPLETED, today, now);
        if (completedCount > 0) {
            log.info("có {} cai da hoan thanh trong ngaày {}", completedCount, today);
        }
    }
}
