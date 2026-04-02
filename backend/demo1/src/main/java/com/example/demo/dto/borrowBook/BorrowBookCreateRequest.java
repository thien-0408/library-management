package com.example.demo.dto.borrowBook;

import com.example.demo.entity.Book;
import com.example.demo.entity.User;
import com.example.demo.enums.BookPendingStatus;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldNameConstants;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants(level = AccessLevel.PRIVATE)
public class BorrowBookCreateRequest {
    UUID userId;
    UUID bookId;
}
