package com.example.demo.init;

import com.example.demo.entity.User;
import com.example.demo.enums.Role;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import static java.rmi.server.LogStream.log;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitialization implements CommandLineRunner {
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    @Override
    public void run(String... args) throws Exception {
        if(userRepository.count() == 0){
            User admin = new User();
            admin.setRole(Role.ADMIN);
            admin.setEmail("adminlib@gmail.com");
            admin.setPasswordHash(encoder.encode("Admin@123!"));

            userService.addUser(admin);
        }else{
            log("Admin existed");
        }
    }
}
