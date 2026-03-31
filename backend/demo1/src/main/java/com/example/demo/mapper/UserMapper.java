package com.example.demo.mapper;

import com.example.demo.dto.user.RegisterDto;
import com.example.demo.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "passwordHash", ignore = true)
    User toUser(RegisterDto request);

    RegisterDto toRegisterResponse(User user);
}
