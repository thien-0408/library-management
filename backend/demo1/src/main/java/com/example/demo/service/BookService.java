package com.example.demo.service;

import com.example.demo.dto.book.BookCreationRequest;
import com.example.demo.dto.book.BookGetRequest;
import com.example.demo.dto.book.BookResponse;
import com.example.demo.dto.book.BookUpdateRequest;
import com.example.demo.enums.DocumentType;
import org.hibernate.query.Page;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface BookService {
    BookResponse getBookById(UUID id);
    List<BookResponse> searchBooks(BookGetRequest request);
    BookResponse createBook(BookCreationRequest bookCreationRequest) throws IOException;
    BookResponse updateBook(BookUpdateRequest bookUpdateRequest, String isbn) throws IOException;
    void deleteBook(String isbn) ;
}
