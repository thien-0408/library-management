package com.example.demo.entity;

import com.example.demo.enums.BookingStatus;
import com.example.demo.enums.StateViewerStatus;
import com.example.demo.enums.StatusViewerMessage;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "rooms")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @Min(value = 0, message = "Number of seats can not be negative")
    private int numberOfSeats;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus bookingStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StateViewerStatus stateViewerStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusViewerMessage statusViewerMessage;

}
