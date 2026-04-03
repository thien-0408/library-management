package com.example.demo.repository;

import com.example.demo.entity.BorrowBookRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface BorrowBookRequestRepository extends JpaRepository<BorrowBookRequest, UUID>, JpaSpecificationExecutor<BorrowBookRequest> {

}
