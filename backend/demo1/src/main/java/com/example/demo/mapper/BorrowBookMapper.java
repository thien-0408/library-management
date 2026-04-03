package com.example.demo.mapper;

import com.example.demo.dto.borrowBook.*;
import com.example.demo.entity.BorrowBookRequest;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BorrowBookMapper {

    BorrowBookRequest toBorrowBookRequest(BorrowBookCreateRequest request);

    @Mapping(source = "user.fullName", target = "userName")
    @Mapping(source = "book.title", target = "bookTitle")
    BorrowBookResponse toBorrowBookResponse(BorrowBookRequest entity);
    List<BorrowBookResponse> toBorrowBookResponseList(List<BorrowBookRequest> entities);
    void updateBorrowBookRequest(BorrowBookUpdateRequest request, @MappingTarget BorrowBookRequest entity);
}