package com.example.demo.service;

import com.example.demo.dto.token.TokenResponse;
import com.example.demo.dto.user.LoginDto;
import com.example.demo.dto.user.RegisterDto;
import com.example.demo.entity.User;
import com.example.demo.enums.ErrorCode;
import com.example.demo.enums.Role;
import com.example.demo.exception.AppException;
import com.example.demo.mapper.UserMapper;
import com.example.demo.repository.UserRepository;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
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
        try{
            User savedUser = repo.save(user);
            return mapper.toRegisterResponse(savedUser);
        }catch (DataIntegrityViolationException e){
            throw new AppException(ErrorCode.USER_EXISTED);
        }
    }

    @Override
    public TokenResponse login(LoginDto request) {
        User user = repo.findUserByEmail(request.getEmail()).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
        if(!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())){
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);
        }
        return createTokenResponse(user);
    }

    private TokenResponse createTokenResponse(User user){
        String accessToken = jwtService.createToken(user);
        String refreshToken = generateAndSetRefreshToken(user);
        return TokenResponse.builder().accessToken(accessToken).refreshToken(refreshToken).build();
    }
    //Validate token
    private User validateRefreshToken(UUID userId, String refreshToken){
        User user = repo.findById(userId).orElse(null);
        if(user == null || user.getRefreshToken() == null
                || !user.getRefreshToken().equals(refreshToken) || user.getTokenExpireTime().isBefore(LocalDateTime.now())){
            return null;
        }
        return user;
    }
    private String generateAndSetRefreshToken(User user){
        String refreshToken = generateRefreshTokenString();
        user.setRefreshToken(refreshToken);
        user.setTokenExpireTime(LocalDateTime.now().plusDays(1));
        repo.save(user);
        return refreshToken;
    }
    //Generate
    private String generateRefreshTokenString(){
        byte[] random = new byte[64];
        secureRandom.nextBytes(random);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(random);
    }
}
