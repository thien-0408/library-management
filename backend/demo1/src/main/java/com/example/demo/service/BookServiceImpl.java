package com.example.demo.service;

import com.example.demo.dto.book.BookCreationRequest;
import com.example.demo.dto.book.BookResponse;
import com.example.demo.dto.book.BookUpdateRequest;
import com.example.demo.entity.Book;
import com.example.demo.enums.ErrorCode;
import com.example.demo.exception.AppException;
import com.example.demo.mapper.BookMapper;
import com.example.demo.repository.BookRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookServiceImpl implements BookService {
    BookRepository bookRepository;
    BookMapper bookMapper;

    @Override
    public List<BookResponse> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        return bookMapper.toBookResponseList(books);
    }

    @Override
    public BookResponse getBookById(UUID id) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND)) ;
        return bookMapper.toBookResponse(book);
    }

    @Override
    public BookResponse getBookByISBN(String isbn) {
        Book book = bookRepository.findByIsbn(isbn).orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
        return bookMapper.toBookResponse(book);
    }

    @Override
    public List<BookResponse> getBookByTitle(String title) {
        List<Book> books = bookRepository.findByTitle(title);
        return bookMapper.toBookResponseList(books);
    }

    @Override
    public List<BookResponse> getBookByAuthor(String author) {
        List<Book> books = bookRepository.findByAuthor(author);
        return bookMapper.toBookResponseList(books);
    }

    @Override
    public List<BookResponse> getBookByCategory(String category) {
        List<Book> books = bookRepository.findByCategory(category);
        return bookMapper.toBookResponseList(books);
    }

    @Transactional
    @Override
    public BookResponse createBook(BookCreationRequest bookCreationRequest) {
        if (bookRepository.existsByIsbn(bookCreationRequest.getIsbn())) {
            throw new AppException(ErrorCode.BOOK_EXISTED);
        }
        Book newBook = bookMapper.toBook(bookCreationRequest);
        newBook = bookRepository.save(newBook);
        return bookMapper.toBookResponse(newBook);
    }

    @Transactional
    @Override
    public BookResponse updateBook(BookUpdateRequest bookUpdateRequest) {
        Book existedBook = bookRepository.findByIsbn(bookUpdateRequest.getIsbn()).orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
        bookMapper.updateBookFromRequest(bookUpdateRequest, existedBook);
        bookRepository.save(existedBook);
        return bookMapper.toBookResponse(existedBook);
    }

    @Transactional
    @Override
    public void deleteBook(UUID id) {
        Book existedBook = bookRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
        bookRepository.delete(existedBook);
    }

}
