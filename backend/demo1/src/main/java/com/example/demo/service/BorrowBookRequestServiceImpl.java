package com.example.demo.service;

import com.example.demo.common.validator.BookValidator;
import com.example.demo.dto.borrowBook.BorrowBookCreateRequest;
import com.example.demo.dto.borrowBook.BorrowBookResponse;
import com.example.demo.dto.borrowBook.BorrowBookUpdateRequest;
import com.example.demo.entity.Book;
import com.example.demo.entity.BorrowBookRequest;
import com.example.demo.enums.BookPendingStatus;
import com.example.demo.enums.BookStatus;
import com.example.demo.enums.DocumentType;
import com.example.demo.enums.ErrorCode;
import com.example.demo.exception.AppException;
import com.example.demo.mapper.BorrowBookMapper;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.BorrowBookRequestRepository;
import com.example.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@AllArgsConstructor
public class BorrowBookRequestServiceImpl implements  BorrowBookRequestService{
    BorrowBookRequestRepository borrowBookRequestRepository;
    BookRepository bookRepository;
    BorrowBookMapper borrowBookMapper;
    UserRepository userRepository;
    BookValidator bookValidator;

    public List<BorrowBookResponse> getBorrowBookRequests(BookPendingStatus status ) {
        Specification<BorrowBookRequest> spec = Specification.where(null);
        if (status != null) {
            spec = spec.and(((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("status"), status)));
        }
        List<BorrowBookRequest> response = borrowBookRequestRepository.findAll(spec);
        return borrowBookMapper.toBorrowBookResponseList(response);
    }

    @Transactional
    public BorrowBookResponse createBorrowBookRequest(BorrowBookCreateRequest request) {
        var user = userRepository.findByEmail(request.getUserEmail()).orElseThrow(()->new AppException(ErrorCode.USER_NOT_FOUND));
        var book = bookRepository.findByIsbn(request.getBookIsbn()).orElseThrow(()->new AppException(ErrorCode.BOOK_NOT_FOUND));
        BorrowBookRequest newBookRequest = new BorrowBookRequest();

        if (book.getStatus() == BookStatus.NOT_AVAILABLE) {
            throw new AppException(ErrorCode.OUT_OF_STOCK);
        }
        newBookRequest.setUser(user);
        newBookRequest.setBook(book);

        if (newBookRequest.getBook().getDocumentType() == DocumentType.BOOK){
            newBookRequest.setStatus(BookPendingStatus.APPROVED);
            book.setAvailableCopies(book.getAvailableCopies() - 1);
            bookRepository.save(book);
        } else {
            newBookRequest.setStatus(BookPendingStatus.PENDING);
        }
        bookValidator.validateBookAvailability(book);
        borrowBookRequestRepository.save(newBookRequest);
        BorrowBookResponse response = borrowBookMapper.toBorrowBookResponse(newBookRequest);
        response.setUserName(newBookRequest.getUser().getUserName());
        response.setBookTitle(newBookRequest.getBook().getTitle());
        return response;
    }

    @Transactional
    public BorrowBookResponse updateStatus(BorrowBookUpdateRequest request, UUID id) {

        BorrowBookRequest existedRequest = borrowBookRequestRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BOOK_REQUEST_NOT_FOUND));
        if (request.getStatus() == BookPendingStatus.APPROVED
                && existedRequest.getStatus() == BookPendingStatus.PENDING) {

            Book book = existedRequest.getBook();
            if (book.getAvailableCopies() <= 0) {
                throw new AppException(ErrorCode.OUT_OF_STOCK);
            }
            book.setAvailableCopies(book.getAvailableCopies() - 1);
            bookRepository.save(book);
        }

        borrowBookMapper.updateBorrowBookRequest(request, existedRequest);
        borrowBookRequestRepository.save(existedRequest);
        return borrowBookMapper.toBorrowBookResponse(existedRequest);
    }
}
