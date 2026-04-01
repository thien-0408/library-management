package com.example.demo.controller;

import com.example.demo.dto.token.TokenResponse;
import com.example.demo.dto.user.LoginDto;
import com.example.demo.dto.user.RegisterDto;
import com.example.demo.dto.user.UserResponseDto;
import com.example.demo.entity.ApiResponse;
import com.example.demo.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
@RequestMapping("api/auth")
@AllArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ApiResponse<RegisterDto> register(@RequestBody @Valid RegisterDto request){
        return ApiResponse.<RegisterDto>builder().result(authenticationService.register(request)).message("Account created").build();
    }

    @PostMapping("/login")
    public ApiResponse<TokenResponse> login(@RequestBody @Valid LoginDto request){
        return ApiResponse.<TokenResponse>builder().result(authenticationService.login(request)).message("Login success").build();
    }
}
