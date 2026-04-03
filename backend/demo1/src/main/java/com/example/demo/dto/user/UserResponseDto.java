package com.example.demo.dto.user;

import lombok.Data;

@Data
public class UserResponseDto {
    private String email;
    private String password;
    private String avatarUrl;
}
