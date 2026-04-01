package com.example.demo.dto.book;

import com.example.demo.enums.BookStatus;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookUpdateRequest {
    @NotNull
    String title;
    String author;
    String isbn;
    @Size(min = 1, message = "Invalid year of publication")
    Integer yearOfPublication;
    String category;
    @Size(min = 0,message = "Number of copies can not be negative")
    Integer availableCopies;
    String imageUrl;
    @Enumerated(EnumType.STRING)
    BookStatus status;
}
