# Backend .NET API Reference

Working reference for frontend and backend updates.

Project root: `backend-dotnet/backend-dotnet`

## Overview

- API style: ASP.NET Core controllers via `app.MapControllers()`
- Auth: JWT bearer with active-user validation on every authenticated request
- Serialization: enums serialize as strings via `JsonStringEnumConverter`
- File uploads: auth profile and book create/update use `multipart/form-data`
- Pagination wrapper: `PagedResultDto<T>` returns `items`, `page`, `pageSize`, `totalItems`, `totalPages`

## Auth

Controller: `Controllers/AuthController.cs`

| Method | Route | Auth | Request | Response | Notes |
| --- | --- | --- | --- | --- | --- |
| `POST` | `/api/auth/register` | None | `RegisterRequestDto` form | `RegisterResponseDto` | Creates active student user |
| `GET` | `/api/auth/profile` | User | None | `RegisterResponseDto` | Active users only |
| `PUT` | `/api/auth/profile` | User | `UpdateProfileRequestDto` form | `RegisterResponseDto` | Updates full name/avatar |
| `POST` | `/api/auth/login` | None | `LoginRequestDto` body | `TokenResponseDto` | Requires `IsActive = true` |
| `POST` | `/api/auth/refresh` | None | `RefreshTokenRequestDto` body | `TokenResponseDto` | Rotates refresh token; backend stores token hash |
| `POST` | `/api/auth/logout` | User | None | `204 No Content` | Clears refresh token |

DTOs: `DTOs/Auth`

- `RegisterRequestDto`: `FullName`, `Email`, `Password`, `Avatar`
- `RegisterResponseDto`: `Id`, `Email`, `FullName`, `Role`, `AvatarUrl`
- `UpdateProfileRequestDto`: `FullName?`, `Avatar?`
- `LoginRequestDto`: `Email`, `Password`
- `RefreshTokenRequestDto`: `RefreshToken`
- `TokenResponseDto`: `AccessToken`, `RefreshToken`

## Admin Users

Controller: `Controllers/AdminUsersController.cs`

Route prefix: `/api/admin/users`

Auth: admin only

| Method | Route | Request | Response | Notes |
| --- | --- | --- | --- | --- |
| `GET` | `/api/admin/users?includeInactive=false&page=1&pageSize=20` | query | `PagedResultDto<AdminUserResponseDto>` | Lists users |
| `GET` | `/api/admin/users/{id}` | none | `AdminUserResponseDto` | Gets one user |
| `POST` | `/api/admin/users` | `AdminCreateUserRequestDto` | `AdminUserResponseDto` | Creates active user |
| `PATCH` | `/api/admin/users/{id}` | `AdminUpdateUserRequestDto` | `AdminUserResponseDto` | Updates user fields/reactivates |
| `DELETE` | `/api/admin/users/{id}` | none | `204 No Content` | Soft delete: `IsActive = false`, clears refresh token |

DTOs: `DTOs/AdminUsers`

- `AdminUserResponseDto`: `Id`, `Email`, `FullName`, `Role`, `AvatarUrl`, `IsActive`, `CreatedAt`
- `AdminCreateUserRequestDto`: `Email`, `FullName`, `Password`, `Role`
- `AdminUpdateUserRequestDto`: `Email?`, `FullName?`, `Role?`, `IsActive?`

## Admin Dashboard

Controller: `Controllers/AdminDashboardController.cs`

Route prefix: `/api/admin/dashboard`

Auth: admin only

| Method | Route | Response | Notes |
| --- | --- | --- | --- |
| `GET` | `/api/admin/dashboard/stats` | `DashboardStatsResponseDto` | Counts users, books, borrow states, holds, fines, today's room reservations |

DTOs: `DTOs/Admin`

- `DashboardStatsResponseDto`: `ActiveUsers`, `TotalBooks`, `BorrowedBooks`, `OverdueBooks`, `PendingBorrowRequests`, `WaitingBookHolds`, `UnpaidFines`, `UnpaidFineAmount`, `RoomReservationsToday`

## Books

Controller: `Controllers/BookController.cs`

Route prefix: `/api/books`

| Method | Route | Auth | Request | Response | Notes |
| --- | --- | --- | --- | --- | --- |
| `GET` | `/api/books/{id:guid}` | None | none | `BookResponseDto` | Fetches by GUID |
| `GET` | `/api/books` | None | `GetBooksQueryDto` query | `PagedResultDto<BookResponseDto>` | Supports filters and pagination |
| `POST` | `/api/books` | Admin | `CreateBookRequestDto` form | `BookResponseDto` | Optional image/document upload and online URL |
| `PUT` | `/api/books/{isbn}` | Admin | `UpdateBookRequestDto` form | `BookResponseDto` | Updates by ISBN |
| `DELETE` | `/api/books/{isbn}` | Admin | none | `204 No Content` | Deletes by ISBN |

DTOs: `DTOs/Books`

- `GetBooksQueryDto`: `Isbn`, `Title`, `Author`, `Category`, `DocumentType`, `Page`, `PageSize`
- `CreateBookRequestDto`: `Title`, `Author?`, `Isbn`, `YearOfPublication?`, `Category`, `AvailableCopies`, `Image?`, `BookOnlineUrl?`, `DocumentFile?`, `DocumentType`
- `UpdateBookRequestDto`: optional `Title`, `Author`, `YearOfPublication`, `Category`, `AvailableCopies`, `Image`, `BookOnlineUrl`, `DocumentFile`, `DocumentType`
- `BookResponseDto`: `Id`, `Title`, `Author`, `Isbn`, `YearOfPublication`, `Category`, `AvailableCopies`, `ImageUrl`, `BookOnlineUrl`, `DocumentFileUrl`, `Status`, `DocumentType`

Notes:

- `GET` uses GUID id; update/delete use ISBN.
- `GET /api/books` is the book/document search endpoint. It supports `Isbn`, `Title`, `Author`, `Category`, `DocumentType`, `Page`, and `PageSize` query filters.
- If returned copies make a book available, the next waiting hold is notified.

## Borrow Book Requests

Controller: `Controllers/BorrowBookRequestsController.cs`

Route prefix: `/api/books/requests`

Controller auth: user required

| Method | Route | Auth | Request | Response | Notes |
| --- | --- | --- | --- | --- | --- |
| `GET` | `/api/books/requests/me` | User | none | `IReadOnlyList<BorrowBookResponseDto>` | Current user's borrow history |
| `POST` | `/api/books/requests` | User | `CreateBorrowBookRequestDto` | `BorrowBookResponseDto` | Creates online/offline borrow and notification; no manual document approval |
| `PUT` | `/api/books/requests/{id}/return` | User | none | `BorrowBookResponseDto` | Returns approved offline borrow and notifies next hold |
| `GET` | `/api/books/requests?status=&page=1&pageSize=20` | Admin | `GetBorrowBookRequestsQueryDto` query | `PagedResultDto<BorrowBookResponseDto>` | Admin list |
| `PUT` | `/api/books/requests/{id}` | Admin | `UpdateBorrowBookRequestDto` | `BorrowBookResponseDto` | Legacy pending-request review; new document borrows do not require it |

DTOs: `DTOs/BorrowBooks`

- `CreateBorrowBookRequestDto`: `BookIsbn`, `BorrowMode`
- `UpdateBorrowBookRequestDto`: `Status`
- `GetBorrowBookRequestsQueryDto`: `Status?`, `Page`, `PageSize`
- `BorrowBookResponseDto`: `Id`, `UserId`, `UserName`, `BookId`, `BookTitle`, `BookIsbn`, `UrlImage`, `BorrowMode`, `OfflineBorrowCode`, `OnlineAccessUrl`, `BorrowedAt`, `DueDate`, `ReturnedAt`, `IsOverdue`, `WarningMessage`, `DocumentType`, `Status`

Enums: `BorrowMode`: `OFFLINE`, `ONLINE`

Borrow rules:

- `OFFLINE` checks physical copies and hold priority, immediately creates an `APPROVED` borrow, decreases `AvailableCopies`, generates unique `OfflineBorrowCode`, and sends a notification with type `OFFLINE_BORROW_CODE`.
- `ONLINE` requires `BookOnlineUrl` or `DocumentFileUrl`, immediately creates an `APPROVED` borrow, does not decrease physical copies, stores `OnlineAccessUrl`, and sends a notification with type `ONLINE_ACCESS`.
- For `DOCUMENT`, admin manual approval is no longer required in the new create flow.

## Book Holds

Controller: `Controllers/BookHoldsController.cs`

Route prefix: `/api/books/holds`

Controller auth: user required

| Method | Route | Auth | Request | Response | Notes |
| --- | --- | --- | --- | --- | --- |
| `GET` | `/api/books/holds/me` | User | none | `IReadOnlyList<BookHoldResponseDto>` | Current user's holds |
| `GET` | `/api/books/holds` | Admin | none | `IReadOnlyList<BookHoldResponseDto>` | Admin list of holds |
| `POST` | `/api/books/holds` | User | `CreateBookHoldRequestDto` | `BookHoldResponseDto` | Creates hold only when no copies are available |
| `PATCH` | `/api/books/holds/{id}/cancel` | Owner or admin | none | `204 No Content` | Cancels waiting/notified hold |

DTOs: `DTOs/BookHolds`

- `CreateBookHoldRequestDto`: `BookIsbn`
- `BookHoldResponseDto`: `Id`, `UserId`, `UserName`, `BookId`, `BookTitle`, `BookIsbn`, `Status`, `CreatedAt`, `NotifiedAt`

Enums: `BookHoldStatus`: `WAITING`, `NOTIFIED`, `CANCELLED`, `FULFILLED`

Hold rules:

- Returned copies notify the oldest `WAITING` hold.
- A `NOTIFIED` hold reserves borrow priority for that user.
- Other users cannot borrow that book while a notified hold is active.
- Notified holds expire after 2 days and become `CANCELLED`.
- When the notified user borrows the book, the hold becomes `FULFILLED`.

## Notifications

Controller: `Controllers/NotificationsController.cs`

Route prefix: `/api/notifications`

Controller auth: user required

| Method | Route | Request | Response | Notes |
| --- | --- | --- | --- | --- |
| `GET` | `/api/notifications/me?unreadOnly=false` | query | `IReadOnlyList<NotificationResponseDto>` | Current user's notifications |
| `PATCH` | `/api/notifications/{id}/read` | none | `204 No Content` | Marks one notification read |

DTOs: `DTOs/Notifications`

- `NotificationResponseDto`: `Id`, `Title`, `Message`, `Type`, `IsRead`, `CreatedAt`

Enums: `NotificationType`: `BORROW_REQUEST`, `DUE_DATE`, `OVERDUE`, `ROOM_RESERVATION`, `BOOK_AVAILABLE`, `FINE`, `OFFLINE_BORROW_CODE`, `ONLINE_ACCESS`, `ROOM_ACCESS_CODE`

## Fines

Controller: `Controllers/FinesController.cs`

Route prefix: `/api/fines`

Controller auth: user required

| Method | Route | Auth | Request | Response | Notes |
| --- | --- | --- | --- | --- | --- |
| `GET` | `/api/fines/me` | User | none | `IReadOnlyList<OverdueFineResponseDto>` | Current user's fines; generates overdue fines first |
| `GET` | `/api/fines` | Admin | none | `IReadOnlyList<OverdueFineResponseDto>` | All fines; generates overdue fines first |
| `POST` | `/api/fines/generate-overdue` | Admin | none | `204 No Content` | Creates unpaid fines for overdue approved borrows |
| `PATCH` | `/api/fines/{id}/status` | Admin | `UpdateFineStatusRequestDto` | `OverdueFineResponseDto` | Marks fine `UNPAID`, `PAID`, or `WAIVED` |

DTOs: `DTOs/Fines`

- `OverdueFineResponseDto`: `Id`, `BorrowBookRequestId`, `UserId`, `UserName`, `BookTitle`, `BookIsbn`, `OverdueDays`, `Amount`, `Status`, `CreatedAt`, `ResolvedAt`
- `UpdateFineStatusRequestDto`: `Status`

Enums: `FineStatus`: `UNPAID`, `PAID`, `WAIVED`

Rule: fine amount is `5000` per overdue day. Fine generation is idempotent per borrow request; unpaid fine amount/days are updated while overdue.

## Rooms

Controller: `Controllers/RoomController.cs`

Route prefix: `/api/rooms`

| Method | Route | Auth | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/api/rooms` | User | none | `IReadOnlyList<RoomResponseDto>` |
| `GET` | `/api/rooms/availability-room?date=&timeSlotId=` | User | query | `IReadOnlyList<RoomAvailabilityResponseDto>` |
| `GET` | `/api/rooms/occupancy-rooms?date=&timeSlotId=` | Admin | query | `IReadOnlyList<RoomOccupancyResponseDto>` |
| `PATCH` | `/api/rooms/{id}` | Admin | `RoomRequestDto` | `RoomResponseDto` |
| `DELETE` | `/api/rooms/{id}` | Admin | none | `204 No Content` |
| `POST` | `/api/rooms` | Admin | `RoomRequestDto` | `RoomResponseDto` |

DTOs: `DTOs/Rooms`

- `RoomRequestDto`: `Name`, `Description?`, `Capacity`
- `RoomResponseDto`: `Id`, `Name`, `Description`, `Capacity`, `CreatedAt`, `UpdatedAt`
- `RoomAvailabilityResponseDto`: `Id`, `Name`, `Description`, `Capacity`, `SeatsLeft`, `IsFull`
- `RoomOccupancyResponseDto`: `RoomId`, `RoomName`, `Capacity`, `BookedCount`

## Room Reservations

Controller: `Controllers/RoomReservationController.cs`

Route prefix: `/api/room-reservations`

Controller auth: user required

| Method | Route | Auth | Request | Response |
| --- | --- | --- | --- | --- |
| `POST` | `/api/room-reservations` | User | `CreateRoomReservationRequestDto` | `RoomReservationResponseDto` | Creates reservation, generates access code, sends notification |
| `GET` | `/api/room-reservations/upcoming` | User | none | `UpcomingReservationResponseDto?` |
| `GET` | `/api/room-reservations/me` | User | none | `IReadOnlyList<RoomReservationResponseDto>` |
| `PATCH` | `/api/room-reservations/{id}/confirm` | Owner/admin by service | none | `204 No Content` |
| `PATCH` | `/api/room-reservations/{id}/cancel` | Owner/admin by service | none | `204 No Content` |
| `PUT` | `/api/room-reservations/{id}` | Owner/admin by service | `UpdateRoomReservationRequestDto` | `RoomReservationResponseDto` |
| `GET` | `/api/room-reservations` | Admin | none | `IReadOnlyList<RoomReservationResponseDto>` |
| `DELETE` | `/api/room-reservations/{id}` | Admin | none | `204 No Content` |

DTOs: `DTOs/RoomReservations`

- `CreateRoomReservationRequestDto`: `BookingDate`, `RoomId`, `TimeSlotId`
- `UpdateRoomReservationRequestDto`: `BookingDate`, `RoomId`, `TimeSlotId`
- `RoomReservationResponseDto`: `Id`, `RoomId`, `UserId`, `TimeSlotId`, `BookingDate`, `ReservationStatus`, `AccessCode`, `CreatedAt`, `UpdatedAt`
- `UpcomingReservationResponseDto`: `Id`, `RoomId`, `RoomName`, `TimeSlotId`, `StartTime`, `EndTime`, `BookingDate`, `AccessCode`

Logic:

- Creating a room reservation generates a unique 8-character `AccessCode`.
- The user receives the code through `/api/notifications/me` with notification type `ROOM_ACCESS_CODE`.
- The code is also returned in reservation responses for the reservation owner/admin flows.

## Time Slots

Controller: `Controllers/TimeSlotController.cs`

Route prefix: `/api/time-slots`

| Method | Route | Auth | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/api/time-slots` | User | none | `IReadOnlyList<TimeSlotResponseDto>` |
| `POST` | `/api/time-slots` | Admin | `TimeSlotRequestDto` | `TimeSlotResponseDto` |
| `PATCH` | `/api/time-slots/{id}` | Admin | `TimeSlotRequestDto` | `TimeSlotResponseDto` |
| `DELETE` | `/api/time-slots/{id}` | Admin | none | `204 No Content` |

DTOs: `DTOs/TimeSlots`

- `TimeSlotRequestDto`: `StartTime`, `EndTime`
- `TimeSlotResponseDto`: `Id`, `StartTime`, `EndTime`, `CreatedAt`, `UpdatedAt`

Logic:

- `GET /api/time-slots` returns only slots whose `StartTime` is later than the backend server's current local time.
- A background cleanup runs at startup and every minute. It deletes expired time slots only when no room reservation references them, preserving reservation history.

## Models Added

- `User.IsActive`: soft-delete flag. Login and JWT validation require active users.
- `Notification`: user notifications.
- `OverdueFine`: overdue fine records.
- `BookHold`: book reservation/hold queue records.

## Migrations

- `20260518150835_addUserIsActive`: adds `users.IsActive`.
- `addLibraryFeatureExtensions`: adds notifications, overdue fines, book holds, and relationships.

## Update Checklist

When changing API behavior later, update this file for:

1. Route, verb, or auth changes
2. Request binding changes: body, form, query
3. DTO fields, nullability, enum values
4. Pagination response shape
5. Service-enforced permissions not obvious from attributes
6. Database model or migration changes
