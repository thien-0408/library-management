package com.example.demo.service;

import com.example.demo.dto.book.BookCreationRequest;
import com.example.demo.dto.book.BookResponse;
import com.example.demo.dto.book.BookUpdateRequest;
import com.example.demo.enums.DocumentType;
import org.hibernate.query.Page;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface BookService {
    List<BookResponse> getAllBooks();
    BookResponse getBookById(UUID id);
    List<BookResponse> searchBooks(String isbn, String title, String author, String category, DocumentType documentType);
    BookResponse createBook(BookCreationRequest bookCreationRequest) throws IOException;
    BookResponse updateBook(BookUpdateRequest bookUpdateRequest, UUID id) throws IOException;
    void deleteBook(UUID id);
}
