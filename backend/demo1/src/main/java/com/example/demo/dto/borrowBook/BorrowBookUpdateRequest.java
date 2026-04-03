package com.example.demo.dto.borrowBook;

import com.example.demo.entity.Book;
import com.example.demo.entity.User;
import com.example.demo.enums.BookPendingStatus;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BorrowBookUpdateRequest {
    BookPendingStatus status;
}
