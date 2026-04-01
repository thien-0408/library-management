package com.example.demo.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    USER_EXISTED(1001, "User existed", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1004, "User not found", HttpStatus.NOT_FOUND),
    PASSWORD_NOT_MATCH(1005, "Incorrect password.", HttpStatus.BAD_REQUEST),
    UNCATEGORIZED_ERROR(9999, "Undefined error", HttpStatus.BAD_REQUEST);
    ErrorCode(int code, String message, HttpStatus statusCode){
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
    private int code;
    private String message;
    private final HttpStatus statusCode;
}
