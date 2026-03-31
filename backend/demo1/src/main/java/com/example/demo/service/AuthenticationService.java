package com.example.demo.service;

import com.example.demo.dto.token.TokenResponse;
import com.example.demo.dto.user.LoginDto;
import com.example.demo.dto.user.RegisterDto;

public interface AuthenticationService {
    RegisterDto register(RegisterDto request);
    TokenResponse login(LoginDto request);
}
