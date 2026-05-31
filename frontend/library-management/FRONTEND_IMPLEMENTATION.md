# Frontend Implementation Guide: New Features

This guide outlines the newly added backend APIs and how the frontend should integrate them.

## 1. Book Reviews & Ratings
The system now allows users to rate and review books. It also aggregates the average rating for each book.

### Endpoints
* `GET /api/books/reviews/book/{bookId}` - Get all reviews for a specific book.
* `GET /api/books/reviews/book/{bookId}/summary` - Get average rating and total reviews for a book.
* `GET /api/books/reviews/me` - Get all reviews written by the currently logged-in user.
* `POST /api/books/reviews` - Submit a new review.
  * **Payload:** `{ "bookIsbn": "string", "rating": number (1-5), "comment": "string?" }`
* `PUT /api/books/reviews/{id}` - Update an existing review.
* `DELETE /api/books/reviews/{id}` - Delete a review.

**Note:** `BookResponseDto` (from `/api/books/{id}` and `/api/books`) now includes `AverageRating` (double?) and `TotalReviews` (int).

---

## 2. Reading Lists / Collections
Users can curate custom collections of books or use built-in lists like "To Read" or "Favorites".

### Endpoints
* `GET /api/reading-lists/me` - Get all reading lists for the current user.
* `GET /api/reading-lists/{id}` - Get detailed information and books for a specific list.
* `POST /api/reading-lists` - Create a new reading list.
  * **Payload:** `{ "name": "string", "description": "string?", "listType": "TO_READ | FAVORITES | RESEARCH_MATERIAL | CUSTOM" }`
* `PUT /api/reading-lists/{id}` - Update a list's name or description.
* `DELETE /api/reading-lists/{id}` - Delete a reading list entirely.
* `POST /api/reading-lists/{id}/items` - Add a book to a specific reading list.
  * **Payload:** `{ "bookIsbn": "string", "notes": "string?" }`
* `DELETE /api/reading-lists/{id}/items/{itemId}` - Remove a book from a list.

---

## 3. Gamification & Badges
To improve user engagement, users earn points and badges for borrowing books, writing reviews, maintaining activity streaks, and booking rooms.

### Endpoints
* `GET /api/gamification/me` - Get the current user's gamification profile.
  * **Returns:** Total points, reading stats, current/longest streaks, and an array of earned badges.
* `GET /api/gamification/leaderboard?top={number}` - Get the top users ranked by total points. Publicly accessible.

**Gamification Rules:**
* Borrowing a book: +10 pts
* Writing a review: +5 pts
* Reserving a room: +3 pts
* Badges are automatically awarded for milestones (e.g., 1st borrow, 5th review, 7-day streak) and trigger real-time notifications (`NotificationType.BADGE_EARNED`).

---

## 4. E-Reader / PDF Viewer Integration
The backend serves digital document files statically. For documents (`DocumentType = DOCUMENT`), the frontend should implement an embedded reader (e.g., PDF.js).

### How to Implement
1. When viewing a book details page, check if `documentType === 'DOCUMENT'`.
2. If true, the `documentFileUrl` property in `BookResponseDto` will contain the path to the digital file.
3. Use a web PDF viewer component to embed the file at that URL directly in the browser instead of just providing a download link.
4. For borrowed digital documents, the user will be provided an `onlineAccessUrl` in their `BorrowBookResponseDto` which they can use to read the book in the built-in viewer.

---

## 5. Admin Dashboard Updates
The `DashboardStatsResponseDto` from `/api/admin/dashboard/stats` now includes a new property:
* `totalBookReviews` - The total number of reviews submitted across the entire library system.
