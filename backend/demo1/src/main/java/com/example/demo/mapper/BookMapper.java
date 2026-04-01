package com.example.demo.mapper;

import com.example.demo.dto.book.BookCreationRequest;
import com.example.demo.dto.book.BookResponse;
import com.example.demo.dto.book.BookUpdateRequest;
import com.example.demo.entity.Book;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BookMapper {

    Book toBook(BookCreationRequest dto);
    BookResponse toBookResponse(Book dto);
    Book toBook(BookUpdateRequest dto);
    List<BookResponse> toBookResponseList(List<Book> dtoList);

    void updateBookFromRequest(BookUpdateRequest request, @MappingTarget Book entity);
}
