package com.example.demo.init;

import com.example.demo.entity.User;
import com.example.demo.enums.Role;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import lombok.NoArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@NoArgsConstructor
public class DataInitialization implements CommandLineRunner {
    UserService userService;
    UserRepository userRepository;
    @Override
    public void run(String... args) throws Exception {
        if(userRepository.count() == 0){
            User admin = new User();
            admin.setRole(Role.ADMIN);
            admin.setUserName("admin");
            admin.setPasswordHash("Admin@123!");

        }
    }
}
