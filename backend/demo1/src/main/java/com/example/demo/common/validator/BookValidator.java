package com.example.demo.common.validator;

import com.example.demo.entity.Book;
import com.example.demo.enums.BookStatus;
import com.example.demo.enums.ErrorCode;
import com.example.demo.exception.AppException;
import com.example.demo.repository.BookRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookValidator {
    BookRepository bookRepository;
    public void validateBookAvailability(Book book) {
        if (book.getAvailableCopies() < 0){
            throw new AppException(ErrorCode.INVALID_BOOK_COPIES);
        }
        if (book.getAvailableCopies() == 0) {
            book.setStatus(BookStatus.NOT_AVAILABLE);
        } else {
            book.setStatus(BookStatus.AVAILABLE);
        }
    }
}
