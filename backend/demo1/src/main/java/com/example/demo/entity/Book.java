package com.example.demo.entity;

import com.example.demo.enums.BookStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(nullable = false)
    String title;

    String author;

    String isbn;

    @Min(value = 1, message = "Invalid year of publication")
    Integer yearOfPublication;

    @Column(nullable = false)
    String category;

    @Min(value = 0, message = "Number of copies can not be negative")
    Integer availableCopies;

    String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    BookStatus status;
}
