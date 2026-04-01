package com.example.demo.repository;

import com.example.demo.dto.book.BookResponse;
import com.example.demo.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookRepository extends JpaRepository<Book, UUID> {
    List<Book> findByTitle(String title);
    Optional<Book> findByIsbn(String isbn);
    List<Book> findByAuthor(String author);
    List<Book> findByCategory(String category);

    boolean existsByIsbn(String isbn);
}
