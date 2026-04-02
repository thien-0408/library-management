package com.example.demo.dto.borrowBook;

import com.example.demo.enums.BookPendingStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BorrowBookResponse {
    UUID id;
    String userName;
    String bookTitle;
    BookPendingStatus status;
}
