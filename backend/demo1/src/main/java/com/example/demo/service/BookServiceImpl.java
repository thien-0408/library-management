package com.example.demo.service;

import com.example.demo.dto.book.BookCreationRequest;
import com.example.demo.dto.book.BookResponse;
import com.example.demo.dto.book.BookUpdateRequest;
import com.example.demo.entity.Book;
import com.example.demo.enums.DocumentType;
import com.example.demo.enums.ErrorCode;
import com.example.demo.exception.AppException;
import com.example.demo.mapper.BookMapper;
import com.example.demo.repository.BookRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookServiceImpl implements BookService {
    BookRepository bookRepository;
    BookMapper bookMapper;
    FileService fileService;

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
    public List<BookResponse> searchBooks(String isbn, String title, String author, String category, DocumentType documentType) {
        Specification<Book> spec = Specification.where(null);

        if (isbn != null && !isbn.isEmpty()) {
            spec = spec.and(((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("isbn"), isbn)));
        }

        if ( title != null && !title.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.like(criteriaBuilder.lower((root.get("title"))), "%" + title + "%"));
        }

        if ( author != null && !author.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.like(criteriaBuilder.lower((root.get("author"))), "%" + author + "%"));
        }

        if (category != null && !category.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("category"), category));
        }

        if (documentType != null) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("documentType"), documentType));
        }

        List<Book> books = bookRepository.findAll(spec);
        return bookMapper.toBookResponseList(books);
    }

    @Transactional
    @Override
    public BookResponse createBook(BookCreationRequest bookCreationRequest) throws IOException {
        if (bookRepository.existsByIsbn(bookCreationRequest.getIsbn())) {
            throw new AppException(ErrorCode.BOOK_EXISTED);
        }
        Book newBook = bookMapper.toBook(bookCreationRequest);
        if (bookCreationRequest.getImage() != null && !bookCreationRequest.getImage().isEmpty()) {
            String imageUrl = fileService.uploadFile(bookCreationRequest.getImage(),"cover_images");
            newBook.setImageUrl(imageUrl);
        }
        newBook = bookRepository.save(newBook);
        return bookMapper.toBookResponse(newBook);
    }

    @Transactional
    @Override
    public BookResponse updateBook(BookUpdateRequest bookUpdateRequest, UUID id) throws IOException {
        Book existedBook = bookRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
        bookMapper.updateBookFromRequest(bookUpdateRequest, existedBook);
        if (bookUpdateRequest.getImage() != null && !bookUpdateRequest.getImage().isEmpty()) {
            String imageUrl = fileService.uploadFile(bookUpdateRequest.getImage(),"cover_images");
            existedBook.setImageUrl(imageUrl);
        }
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
