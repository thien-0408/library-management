package com.example.demo.service;

import com.example.demo.dto.token.TokenResponse;
import com.example.demo.dto.user.LoginDto;
import com.example.demo.dto.user.RegisterDto;
import com.example.demo.entity.User;
import com.example.demo.enums.Role;
import com.example.demo.mapper.UserMapper;
import com.example.demo.repository.UserRepository;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@Builder
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService{
    UserMapper mapper;
    UserRepository repo;
    PasswordEncoder passwordEncoder;
    JwtService jwtService;
    SecureRandom secureRandom = new SecureRandom();


    @Override
    public RegisterDto register(RegisterDto request) {
        User user = mapper.toUser(request);
        user.setRole(Role.STUDENT);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        User savedUser = repo.save(user);
        return mapper.toRegisterResponse(savedUser);
    }

    @Override
    public TokenResponse login(LoginDto request) {
        return null;
    }
}
