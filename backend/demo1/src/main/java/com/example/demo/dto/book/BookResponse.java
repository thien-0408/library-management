package com.example.demo.dto.book;

import com.example.demo.enums.BookStatus;
import com.example.demo.enums.DocumentType;
import lombok.*;
import lombok.experimental.FieldNameConstants;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants(level = AccessLevel.PRIVATE)
public class BookResponse {
    UUID id;
    String title;
    String author;
    String isbn;
    Integer yearOfPublication;
    String category;
    Integer availableCopies;
    String imageUrl;
    BookStatus status;
    DocumentType documentType;
}
