# Book soft delete frontend patch

## Purpose
This note documents the frontend-only changes required when the backend changes `DELETE /api/books/{isbn}` from a physical delete to a soft delete/archive.

## API contract
No request-shape change is required.

- Endpoint stays: `DELETE /api/books/{isbn}`
- Success response stays: `204 No Content`
- `GET /api/books` continues to hide archived books by default

Because of that, the frontend behavior can stay the same: after a successful delete request, remove the book from the local inventory list.

## Files changed
- `app/adminInventory/page.tsx`

## UX changes
Update admin wording so the UI matches archive semantics instead of irreversible deletion semantics.

### Confirmation modal
Before:
- Title: `Delete this book?`
- Description: `This will remove the book from inventory. This action cannot be undone.`
- Confirm label: `Delete book`

After:
- Title: `Archive this book?`
- Description: `This will archive the book and hide it from inventory and catalog listings. Borrow history will be kept.`
- Confirm label: `Archive book`

### Success toast
Before:
- `Book Removed`
- `The book has been deleted from inventory.`

After:
- `Book Archived`
- `The book has been archived and removed from inventory.`

## Current behavior kept intentionally
`app/adminInventory/hooks/useAdminInventory.ts` still removes the book from local state after a successful delete call:

```ts
await adminInventoryService.deleteBook(isbn);
setInventory(prev => prev.filter(b => b.isbn !== isbn));
```

This is still correct because archived books are hidden from the backend inventory query.

## Follow-up ideas
If later you want restore support, add:
- an admin filter for archived books
- a restore endpoint
- a visible archived state in inventory UI
