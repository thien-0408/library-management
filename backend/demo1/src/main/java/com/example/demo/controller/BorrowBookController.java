package com.example.demo.controller;

import com.example.demo.dto.borrowBook.BorrowBookCreateRequest;
import com.example.demo.dto.borrowBook.BorrowBookResponse;
import com.example.demo.dto.borrowBook.BorrowBookUpdateRequest;
import com.example.demo.entity.ApiResponse;
import com.example.demo.entity.BorrowBookRequest;
import com.example.demo.enums.BookPendingStatus;
import com.example.demo.service.BorrowBookRequestService;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/books/requests")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@AllArgsConstructor
public class BorrowBookController {
    BorrowBookRequestService service;

    @GetMapping
    public ApiResponse<List<BorrowBookResponse>> getBorrowBookRequest(@RequestParam(required = false) BookPendingStatus status) {
        var result = service.getBorrowBookRequests(status);
        return  ApiResponse.<List<BorrowBookResponse>>builder().result(result).message("Get request list successfully").build();
    }

    @PostMapping
    public ApiResponse<BorrowBookResponse> createBorrowRequest(@RequestBody BorrowBookCreateRequest request) {
        var result = service.createBorrowBookRequest(request);
        return ApiResponse.<BorrowBookResponse>builder().result(result).message("Request created successfully").build();
    }

    @PutMapping("/{id}")
    public ApiResponse<BorrowBookResponse> updateBorrowBookRequest(@RequestBody BorrowBookUpdateRequest request, @PathVariable UUID id) {
        var result = service.updateStatus(request, id);
        return ApiResponse.<BorrowBookResponse>builder().result(result).message("Update status successfully").build();
    }
}
