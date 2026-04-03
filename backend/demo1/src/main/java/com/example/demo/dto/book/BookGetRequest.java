package com.example.demo.dto.book;

import com.example.demo.enums.DocumentType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level =  AccessLevel.PRIVATE)
public class BookGetRequest {
    String isbn;
    String title;
    String author;
    String category;
    DocumentType documentType;
}
