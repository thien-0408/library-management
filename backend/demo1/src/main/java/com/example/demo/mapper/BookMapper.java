package com.example.demo.mapper;

import com.example.demo.dto.book.BookCreationRequest;
import com.example.demo.dto.book.BookResponse;
import com.example.demo.dto.book.BookUpdateRequest;
import com.example.demo.entity.Book;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE) // <--- QUAN TRỌNG)
public interface BookMapper {

    @Mapping(target = "imageUrl", ignore = true)
    Book toBook(BookCreationRequest dto);
    BookResponse toBookResponse(Book dto);
    Book toBook(BookUpdateRequest dto);
    List<BookResponse> toBookResponseList(List<Book> dtoList);

    @Mapping(target = "imageUrl", ignore = true)
    void updateBookFromRequest(BookUpdateRequest request, @MappingTarget Book entity);
}
