package com.example.demo.service;

import com.example.demo.dto.book.BookCreationRequest;
import com.example.demo.dto.book.BookResponse;
import com.example.demo.dto.book.BookUpdateRequest;
import org.hibernate.query.Page;

import java.util.List;
import java.util.UUID;

public interface BookService {
    List<BookResponse> getAllBooks();
    BookResponse getBookById(UUID id);
    BookResponse getBookByISBN(String isbn);
    List<BookResponse> getBookByTitle(String title);
    List<BookResponse> getBookByAuthor(String author);
    List<BookResponse> getBookByCategory(String category);

    BookResponse createBook(BookCreationRequest bookCreationRequest);
    BookResponse updateBook(BookUpdateRequest bookUpdateRequest);
    void deleteBook(UUID id);
}
