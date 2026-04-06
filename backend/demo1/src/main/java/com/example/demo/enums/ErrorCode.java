package com.example.demo.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    USER_EXISTED(1001, "User existed", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1004, "User not found", HttpStatus.NOT_FOUND),
    PASSWORD_NOT_MATCH(1005, "Incorrect password.", HttpStatus.BAD_REQUEST),
    UNCATEGORIZED_ERROR(9999, "Undefined error", HttpStatus.BAD_REQUEST),
    BOOK_EXISTED(2001, "Book existed", HttpStatus.BAD_REQUEST),
    BOOK_NOT_FOUND(2004, "Book not found", HttpStatus.NOT_FOUND),
    ROOM_NOT_FOUND(1006, "Room not found", HttpStatus.NOT_FOUND),
    ROOM_NAME_EXISTED(1007,"Room name existed", HttpStatus.BAD_REQUEST),
    START_TIME_IS_EXISTED(1008, "Start time existed", HttpStatus.BAD_REQUEST),
    END_TIME_IS_EXISTED(1009,"Start time existed", HttpStatus.BAD_REQUEST),
    TIME_SLOT_NOT_FOUND(10010, "Time slot not found", HttpStatus.NOT_FOUND),
    ROOM_FULL(10011, "Room capacity is full", HttpStatus.BAD_REQUEST),
    USER_ALREADY_BOOKED(10012, "User already booked this room at this time", HttpStatus.BAD_REQUEST),
    ROOM_RESERVATION_NOT_FOUND(10013,"Room Reservation not found", HttpStatus.NOT_FOUND),
    INVALID_BOOKING_DATE(10014, "Booking date must be today or in the future", HttpStatus.BAD_REQUEST),
    INVALID_BOOKING_TIME(10015, "Booking time for today has already passed or is ongoing", HttpStatus.BAD_REQUEST),
    CANNOT_CONFIRM_OUTSIDE_TIME(10016, "You can only confirm within 10 minutes of the start time", HttpStatus.BAD_REQUEST),
    CANNOT_CANCEL_AFTER_START(10017, "You cannot cancel after the booking has started", HttpStatus.BAD_REQUEST);
    OUT_OF_STOCK(2005, "Out of stock", HttpStatus.BAD_REQUEST),
    INVALID_BOOK_COPIES(2006, "Invalid book copies", HttpStatus.BAD_REQUEST),
    BOOK_REQUEST_NOT_FOUND(3004, "Book request not found", HttpStatus.NOT_FOUND);
    ErrorCode(int code, String message, HttpStatus statusCode){
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
    private int code;
    private String message;
    private final HttpStatus statusCode;
}
