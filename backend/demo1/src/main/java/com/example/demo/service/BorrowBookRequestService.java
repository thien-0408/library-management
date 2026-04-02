package com.example.demo.service;

import com.example.demo.dto.borrowBook.BorrowBookCreateRequest;
import com.example.demo.dto.borrowBook.BorrowBookResponse;
import com.example.demo.dto.borrowBook.BorrowBookUpdateRequest;
import com.example.demo.entity.BorrowBookRequest;
import com.example.demo.enums.BookPendingStatus;

import java.util.List;
import java.util.UUID;

public interface BorrowBookRequestService {
     List<BorrowBookResponse> getBorrowBookRequests(BookPendingStatus status );
     BorrowBookResponse createBorrowBookRequest(BorrowBookCreateRequest request);
     BorrowBookResponse updateStatus(BorrowBookUpdateRequest request, UUID id);
}
