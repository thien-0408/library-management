package com.example.demo.dto.book;

import com.example.demo.enums.BookStatus;
import com.example.demo.enums.DocumentType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import javax.print.Doc;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookCreationRequest {
    @NotNull
    String title;
    String author;
    String isbn;

    @Min(value = 1, message = "Invalid year of publication")
    Integer yearOfPublication;

    @NotNull
    String category;

    @Min(value = 0,message = "Number of copies can not be negative")
    Integer availableCopies;

    MultipartFile image;

    @Enumerated(EnumType.STRING)
    DocumentType documentType;
}
