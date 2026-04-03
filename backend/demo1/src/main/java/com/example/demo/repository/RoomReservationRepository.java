package com.example.demo.repository;

import com.example.demo.entity.RoomReservation;
import com.example.demo.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface RoomReservationRepository extends JpaRepository<RoomReservation, UUID> {
    @Query("SELECT r FROM RoomReservation r ORDER BY r.bookingDate ASC, r.timeSlot.startTime ASC")
    List<RoomReservation> findAllSorted();

    @Query("SELECT (COUNT(r) > 0) FROM RoomReservation r WHERE r.timeSlot.id = :timeSlotId " +
           "AND r.bookingDate = :date AND r.user.id = :userId")
    boolean existsBySlotAndDateAndUser(@Param("timeSlotId") UUID timeSlotId,
                                       @Param("date") LocalDate date,
                                       @Param("userId") UUID userId);

    @Query("SELECT (COUNT(r) > 0) FROM RoomReservation r WHERE r.timeSlot.id = :timeSlotId " +
           "AND r.bookingDate = :date AND r.user.id = :userId AND r.id <> :id")
    boolean existsBySlotAndDateAndUserAndIdNot(@Param("timeSlotId") UUID timeSlotId,
                                               @Param("date") LocalDate date,
                                               @Param("userId") UUID userId,
                                               @Param("excludeId") UUID id);

    @Query("SELECT r FROM RoomReservation r WHERE r.user.id = :userId " +
           "AND r.reservationStatus = :status AND r.bookingDate >= :date " +
           "ORDER BY r.bookingDate ASC, r.timeSlot.startTime ASC")
    List<RoomReservation> findUpcomingReservations(@Param("userId") UUID userId,
                                                   @Param("status") ReservationStatus status,
                                                   @Param("date") LocalDate date,
                                                   Pageable pageable);

    @Query("SELECT COUNT(r) FROM RoomReservation r WHERE r.room.id = :roomId " +
           "AND r.timeSlot.id = :timeSlotId AND r.bookingDate = :date " +
           "AND r.reservationStatus IN :statuses")
    int countOccupancy(@Param("roomId") UUID roomId,
                       @Param("timeSlotId") UUID timeSlotId,
                       @Param("date") LocalDate date,
                       @Param("statuses") Collection<ReservationStatus> statuses);

    @Query("SELECT COUNT(r) FROM RoomReservation r WHERE r.room.id = :roomId " +
           "AND r.timeSlot.id = :timeSlotId AND r.bookingDate = :date " +
           "AND r.reservationStatus IN :statuses AND r.id <> :id")
    int countOccupancyAndIdNot(@Param("roomId") UUID roomId,
                               @Param("timeSlotId") UUID timeSlotId,
                               @Param("date") LocalDate date,
                               @Param("statuses") Collection<ReservationStatus> statuses,
                               @Param("id") UUID id);

    @Modifying
    @Transactional
    @Query("UPDATE RoomReservation r SET r.reservationStatus = :newStatus " +
           "WHERE r.reservationStatus = :oldStatus " +
           "AND r.bookingDate = :date " +
           "AND r.timeSlot.startTime <= :timeLimit")
    int bulkUpdateStatusByStartTime(@Param("oldStatus") ReservationStatus oldStatus,
                                   @Param("newStatus") ReservationStatus newStatus,
                                   @Param("date") LocalDate date,
                                   @Param("timeLimit") LocalTime timeLimit);

    @Modifying
    @Transactional
    @Query("UPDATE RoomReservation r SET r.reservationStatus = :newStatus " +
           "WHERE r.reservationStatus = :oldStatus " +
           "AND r.bookingDate = :date " +
           "AND r.timeSlot.endTime <= :timeLimit")
    int bulkUpdateStatusByEndTime(@Param("oldStatus") ReservationStatus oldStatus,
                                   @Param("newStatus") ReservationStatus newStatus,
                                   @Param("date") LocalDate date,
                                   @Param("timeLimit") LocalTime timeLimit);
}
