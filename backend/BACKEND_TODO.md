# Backend TODO

Status: major critical items implemented. Remaining items are backlog/quality improvements.

Audit date: 2026-05-18

Scope: backend API and logic review against `backend-dotnet/API_REFERENCE.md` and current frontend usage.

## Completed Critical Fixes

1. Fixed fine generation to stage notifications in the same DbContext save and update existing unpaid fines instead of creating duplicate unpaid fines.
2. Added hold priority enforcement so active notified holds reserve borrow priority.
3. Added hold fulfillment when notified user borrows.
4. Added stale notified hold expiration after 2 days.
5. Hash refresh tokens before database storage.
6. Added `GET /api/room-reservations/me`.
7. Added admin self-deactivation and last-active-admin protection.

## Remaining Backlog

1. Add broader pagination/filtering to later list endpoints.
   - File: `backend-dotnet/backend-dotnet/Services/FineService.cs`
   - Current issue: the method adds `OverdueFine` entities, then calls `notificationService.CreateAsync()` inside the loop. That service calls `SaveChangesAsync()` using the same DbContext, which can persist partial loop state before the final save.
   - Risk: hard-to-reason transaction behavior, partial updates, repeated saves, and duplicate notification/fine inconsistencies if an error occurs mid-loop.
   - Fix: either add notifications directly to `dbContext.Notifications` in the same method and save once, or introduce a notification method that only stages the entity without saving.

2. Add admin/librarian return flow if staff need to return books for users.
   - File: `backend-dotnet/backend-dotnet/Services/FineService.cs`
   - Current issue: duplicate unpaid fines are blocked, but if a fine is marked `PAID` or `WAIVED` while the book remains overdue, `GenerateOverdueFinesAsync()` can create a new unpaid fine and another notification for the same borrow request.
   - Decide desired rule:
   - Option A: only one fine per borrow request ever.
   - Option B: keep one fine per borrow request and update `OverdueDays`/`Amount` while unpaid.
   - Option C: allow repeated fines, but document and expose that behavior clearly.
   - Recommended: one fine per borrow request, update amount while unpaid.

3. Add consistent validation attributes or FluentValidation.
   - File: `backend-dotnet/backend-dotnet/Services/BorrowBookRequestService.cs`
   - File: `backend-dotnet/backend-dotnet/Services/BookHoldService.cs`
   - Current issue: when a returned book notifies the next hold, the copy remains generally available and any user can borrow it. The notified hold never becomes `FULFILLED` automatically.
   - Required behavior to define:
   - Reserve the returned copy for the notified hold for a time window.
   - Let only that user borrow while hold is `NOTIFIED`.
   - Mark hold `FULFILLED` when the notified user borrows.
   - Expire or cancel notified holds after a timeout.

4. Add notification creation for room reservation events.
   - Files: `BorrowBookRequestService.cs`, `BookHoldService.cs`
   - Current issue: a book with a notified hold can still be borrowed by another user if available copies are greater than zero.
   - Fix: when creating a borrow request, check if active/notified holds exist for that book. If yes, allow only the first notified holder or an admin override.

5. Add due-soon notifications.
   - File: `backend-dotnet/backend-dotnet/Services/AuthService.cs`
   - Current issue: refresh tokens are stored in plaintext in `users.RefreshToken`.
   - Fix: store a hash of refresh token, compare hashes on refresh, rotate token every refresh.

## High Priority

1. Add missing user-facing room reservation list endpoint.
   - Current frontend workaround: profile calls `GET /api/room-reservations`, which is admin-only, catches failure, and shows empty reservations.
   - Add endpoint: `GET /api/room-reservations/me`
   - Response: `IReadOnlyList<RoomReservationResponseDto>`
   - Auth: user
   - Purpose: current user's full room reservation history.

2. Add missing admin/user return flow decision.
   - Current endpoint: `PUT /api/books/requests/{id}/return` is user-only by ownership.
   - Missing possibility: admin/librarian may need to mark a book returned for any user.
   - Add endpoint if needed: `PUT /api/books/requests/{id}/return-admin` or allow admin in existing endpoint.

3. Add pagination to list endpoints introduced later.
   - Current non-paginated endpoints:
   - `GET /api/notifications/me`
   - `GET /api/fines/me`
   - `GET /api/fines`
   - `GET /api/books/holds/me`
   - `GET /api/books/holds`
   - `GET /api/room-reservations`
   - Recommended: support `page`, `pageSize`, optional status filters, and return `PagedResultDto<T>`.

4. Add filtering to admin list endpoints.
   - `GET /api/fines`: filter by `status`, `userId`, date range.
   - `GET /api/books/holds`: filter by `status`, `bookIsbn`, `userId`.
   - `GET /api/notifications/me`: filter by `type`, `isRead`.
   - `GET /api/room-reservations`: filter by `status`, `date`, `roomId`, `userId`.

5. Add consistent validation attributes or FluentValidation.
   - DTOs currently accept empty strings and invalid values in multiple places.
   - Add validation for required fields, email format, password length, positive capacity/copies, valid dates, and time ordering.

6. Normalize response casing assumptions.
   - Backend currently serializes with default System.Text.Json web conventions, likely camelCase.
   - Document this explicitly in `API_REFERENCE.md`.
   - Ensure frontend does not rely on PascalCase fallback long-term.

7. Add admin self-delete protection.
   - File: `AdminUserService.cs`
   - Current issue: admin can soft-delete any user, likely including their own account or the last admin.
   - Fix: prevent deleting current admin user and prevent deleting/deactivating the last active admin.
   - Requires passing current admin id into service methods.

8. Add unique active hold business constraint.
   - Current index: `{ UserId, BookId, Status }` allows multiple active statuses over time but not an actual filtered unique active hold.
   - Add application-level or DB-level protection for only one `WAITING` or `NOTIFIED` hold per user/book.

## Medium Priority

1. Replace service-level authorization ambiguity with clearer controller docs or policies.
   - Room reservation confirm/cancel/update rely on service logic for owner/admin checks.
   - This is acceptable but should be documented in XML/Swagger or extracted into authorization policies.

2. Add notification creation for room reservation events.
   - `NotificationType.ROOM_RESERVATION` exists but is not used.
   - Add notifications for create, confirm, cancel, update.

3. Add due-soon notifications.
   - `NotificationType.DUE_DATE` exists but is not used.
   - Add scheduled/manual endpoint to create due-soon notifications for books due within N days.

4. Add fine recalculation semantics.
   - Decide if unpaid fine amount updates daily as overdue days increase.
   - Current implementation creates once and does not update amount on later days if unpaid.

5. Add audit logging for admin actions.
   - Important actions: user soft-delete/reactivate, fine status update, borrow approval/rejection, book delete, room delete.

6. Add Swagger examples.
   - Helps frontend and future sessions avoid guessing request shapes.

7. Add tests for core business rules.
   - Auth inactive users.
   - Refresh token rotation.
   - Hold queue ordering.
   - Fine generation idempotency.
   - Admin user soft-delete protections.

## API Reference Updates Needed

Update `backend-dotnet/API_REFERENCE.md` after backend fixes:

1. Add `GET /api/room-reservations/me` if implemented.
2. Document fine idempotency/recalculation rule.
3. Document hold queue fulfillment rules.
4. Document response casing.
5. Document pagination/filter params for all list endpoints once added.
