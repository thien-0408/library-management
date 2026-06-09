using backend_dotnet.Context;
using backend_dotnet.DTOs.BookHolds;
using backend_dotnet.Enums;
using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services;

public class BookHoldService(
    LibraryManagementDbContext dbContext,
    INotificationService notificationService,
    ILogger<BookHoldService> logger) : IBookHoldService
{
    private static readonly TimeSpan NotifiedHoldWindow = TimeSpan.FromDays(2);

    public async Task<IReadOnlyList<BookHoldResponseDto>> GetMyHoldsAsync(Guid userId)
    {
        var holds = await dbContext.BookHolds
            .Include(x => x.User)
            .Include(x => x.Book)
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return holds.Select(MapToResponse).ToList();
    }

    public async Task<IReadOnlyList<BookHoldResponseDto>> GetAllAsync()
    {
        var holds = await dbContext.BookHolds
            .Include(x => x.User)
            .Include(x => x.Book)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return holds.Select(MapToResponse).ToList();
    }

    public async Task<BookHoldResponseDto> CreateAsync(Guid userId, CreateBookHoldRequestDto request)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId && x.IsActive);
        if (user is null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        var isbn = request.BookIsbn.Trim();
        var book = await dbContext.Books.FirstOrDefaultAsync(x => x.Isbn == isbn && x.IsActive);
        if (book is null)
        {
            throw new KeyNotFoundException("Book not found.");
        }

        if ((book.AvailableCopies ?? 0) > 0)
        {
            throw new InvalidOperationException("Book is available. Borrow it directly instead of creating a hold.");
        }

        await ExpireStaleNotifiedHoldsAsync(book.Id);

        var hasActiveHold = await dbContext.BookHolds.AnyAsync(x =>
            x.UserId == userId &&
            x.BookId == book.Id &&
            (x.Status == BookHoldStatus.WAITING || x.Status == BookHoldStatus.NOTIFIED));
        if (hasActiveHold)
        {
            throw new InvalidOperationException("User already has an active hold for this book.");
        }

        var hold = new BookHold
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            User = user,
            BookId = book.Id,
            Book = book,
            Status = BookHoldStatus.WAITING,
            CreatedAt = DateTime.UtcNow
        };

        dbContext.BookHolds.Add(hold);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Created book hold {HoldId} for user {UserId}.", hold.Id, userId);
        return MapToResponse(hold);
    }

    public async Task CancelAsync(Guid userId, Guid holdId, bool isAdmin)
    {
        var hold = await dbContext.BookHolds.FirstOrDefaultAsync(x => x.Id == holdId);
        if (hold is null || (!isAdmin && hold.UserId != userId))
        {
            throw new KeyNotFoundException("Book hold not found.");
        }

        if (hold.Status is BookHoldStatus.CANCELLED or BookHoldStatus.FULFILLED)
        {
            throw new InvalidOperationException("Book hold is already closed.");
        }

        hold.Status = BookHoldStatus.CANCELLED;
        await dbContext.SaveChangesAsync();
    }

    public async Task NotifyNextHoldAsync(Guid bookId)
    {
        await ExpireStaleNotifiedHoldsAsync(bookId);

        var hasNotifiedHold = await dbContext.BookHolds.AnyAsync(x => x.BookId == bookId && x.Status == BookHoldStatus.NOTIFIED);
        if (hasNotifiedHold)
        {
            return;
        }

        var hold = await dbContext.BookHolds
            .Include(x => x.Book)
            .Where(x => x.BookId == bookId && x.Status == BookHoldStatus.WAITING)
            .OrderBy(x => x.CreatedAt)
            .FirstOrDefaultAsync();

        if (hold is null)
        {
            return;
        }

        hold.Status = BookHoldStatus.NOTIFIED;
        hold.NotifiedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();

        await notificationService.CreateAsync(
            hold.UserId,
            "Reserved book is available",
            $"{hold.Book?.Title ?? "A reserved book"} is now available.",
            NotificationType.BOOK_AVAILABLE);
    }

    public async Task<bool> CanBorrowAsync(Guid userId, Guid bookId)
    {
        await ExpireStaleNotifiedHoldsAsync(bookId);

        var notifiedHold = await dbContext.BookHolds
            .Where(x => x.BookId == bookId && x.Status == BookHoldStatus.NOTIFIED)
            .OrderBy(x => x.NotifiedAt)
            .FirstOrDefaultAsync();

        return notifiedHold is null || notifiedHold.UserId == userId;
    }

    public async Task FulfillForBorrowAsync(Guid userId, Guid bookId)
    {
        var hold = await dbContext.BookHolds
            .Where(x => x.UserId == userId && x.BookId == bookId && x.Status == BookHoldStatus.NOTIFIED)
            .OrderBy(x => x.NotifiedAt)
            .FirstOrDefaultAsync();

        if (hold is not null)
        {
            hold.Status = BookHoldStatus.FULFILLED;
        }
    }

    private async Task ExpireStaleNotifiedHoldsAsync(Guid bookId)
    {
        var cutoff = DateTime.UtcNow.Subtract(NotifiedHoldWindow);
        var staleHolds = await dbContext.BookHolds
            .Where(x => x.BookId == bookId && x.Status == BookHoldStatus.NOTIFIED && x.NotifiedAt < cutoff)
            .ToListAsync();

        foreach (var hold in staleHolds)
        {
            hold.Status = BookHoldStatus.CANCELLED;
        }

        if (staleHolds.Count > 0)
        {
            await dbContext.SaveChangesAsync();
        }
    }

    private static BookHoldResponseDto MapToResponse(BookHold hold)
    {
        return new BookHoldResponseDto
        {
            Id = hold.Id,
            UserId = hold.UserId,
            UserName = hold.User?.FullName ?? string.Empty,
            BookId = hold.BookId,
            BookTitle = hold.Book?.Title ?? string.Empty,
            BookIsbn = hold.Book?.Isbn ?? string.Empty,
            Status = hold.Status,
            CreatedAt = hold.CreatedAt,
            NotifiedAt = hold.NotifiedAt
        };
    }
}
