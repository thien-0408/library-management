package com.example.demo.controller;

import com.example.demo.dto.book.BookCreationRequest;
import com.example.demo.dto.book.BookResponse;
import com.example.demo.dto.book.BookUpdateRequest;
import com.example.demo.entity.ApiResponse;
import com.example.demo.enums.BookStatus;
import com.example.demo.enums.DocumentType;
import com.example.demo.service.BookService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/books")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@AllArgsConstructor
public class BookController {
    BookService bookService;

//    @GetMapping()
//    public ApiResponse<List<BookResponse>> getAllBooks() {
//        return ApiResponse.<List<BookResponse>>builder().result(bookService.getAllBooks()).message("Get all books successfully").build();
//    }

    @GetMapping("/{id}")
    public ApiResponse<BookResponse> getBookById(@PathVariable UUID id) {
        return ApiResponse.<BookResponse>builder().result(bookService.getBookById(id)).message("Get book successfully").build();
    }

    @GetMapping()
    public ApiResponse<List<BookResponse>> getBooks(
            @RequestParam(required = false) String isbn,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) DocumentType documentType) {

        var result = bookService.searchBooks(isbn, title, author, category, documentType);

        return ApiResponse.<List<BookResponse>>builder()
                .result(result)
                .message("Get books completed")
                .build();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public  ApiResponse<BookResponse> createBook(
            @RequestParam("title") String title,
            @RequestParam(value = "author", required = false) String author,
            @RequestParam("isbn") String isbn,
            @RequestParam(value = "yearOfPublication", required = false) Integer yearOfPublication,
            @RequestParam("category") String category,
            @RequestParam("availableCopies") Integer availableCopies,
            @RequestParam("status") BookStatus status,
            @RequestParam("documentType") DocumentType documentType,
            @RequestPart(value = "image",required = false) MultipartFile image
    ) throws IOException {
        BookCreationRequest request = BookCreationRequest.builder().
                title(title).author(author).isbn(isbn).yearOfPublication(yearOfPublication)
                .category(category).availableCopies(availableCopies).status(status).documentType(documentType).image(image).build();
        BookResponse result = bookService.createBook(request);
        return ApiResponse.<BookResponse>builder().result(result).message("Create book successfully").build();
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<BookResponse> updateBook(@RequestParam(value = "title", required = false) String title,
                                                @RequestParam(value = "author" ,required = false) String author,
                                                @RequestParam(value = "isbn", required = false) String isbn,
                                                @RequestParam(value = "yearOfPublication", required = false) Integer yearOfPublication,
                                                @RequestParam(value = "category", required = false) String category,
                                                @RequestParam(value = "availableCopies", required = false) Integer availableCopies,
                                                @RequestParam(value = "status", required = false) BookStatus status,
                                                @RequestPart(value = "image",required = false) MultipartFile image,
                                                @RequestParam(value = "documentType", required = false) DocumentType documentType,
                                                @PathVariable UUID id) throws IOException {
        BookUpdateRequest request = BookUpdateRequest.builder().
                title(title).author(author).isbn(isbn).yearOfPublication(yearOfPublication)
                .category(category).availableCopies(availableCopies).status(status).documentType(documentType).image(image).build();
        BookResponse result = bookService.updateBook(request, id);
        return ApiResponse.<BookResponse>builder().result(result).message("Update book successfully").build();
    }

    @DeleteMapping("/{id}")
    public  ApiResponse<String> deleteBook(@PathVariable UUID id) {
        bookService.deleteBook(id);
        return ApiResponse.<String>builder().message("Delete book successfully").build();
    }
}
