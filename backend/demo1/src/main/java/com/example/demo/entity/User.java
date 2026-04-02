package com.example.demo.entity;

import com.example.demo.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String email;

    private String fullName;

    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20)")
    private Role role;


    private String avatarUrl;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private String refreshToken;
    private LocalDateTime tokenExpireTime;
}
