package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
@Entity
@Table(name = "time_slots")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class TimeSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(columnDefinition = "time",  nullable = false)
    @NotNull(message = "Start time can not be null")
    LocalTime startTime;

    @Column(columnDefinition = "time",  nullable = false)
    @NotNull(message = "End time can not be null")
    LocalTime endTime;

    @CreationTimestamp
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;

    @OneToMany(mappedBy = "timeSlot")
    private List<RoomReservation> reservations;
}
