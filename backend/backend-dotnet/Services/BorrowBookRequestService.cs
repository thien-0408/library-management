using backend_dotnet.Context;
using backend_dotnet.DTOs.BorrowBooks;
using backend_dotnet.DTOs.Common;
using backend_dotnet.Enums;
using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services;

public class BorrowBookRequestService(
    LibraryManagementDbContext dbContext,
    IBookHoldService bookHoldService,
    INotificationService notificationService,
    IGamificationService gamificationService,
    ILogger<BorrowBookRequestService> logger) : IBorrowBookRequestService
{
    private const int BorrowPeriodDays = 14;
    private static readonly char[] CodeCharacters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".ToCharArray();

    public async Task<IReadOnlyList<BorrowBookResponseDto>> GetMyRequestsAsync(Guid userId)
    {
        var requests = await dbContext.BorrowBookRequests
            .Include(x => x.User)
            .Include(x => x.Book)
            .Where(x => x.UserId == userId)
            .ToListAsync();

        return requests.Select(MapToResponse).ToList();
    }

    public async Task<PagedResultDto<BorrowBookResponseDto>> GetAllAsync(GetBorrowBookRequestsQueryDto query)
    {
        var requests = dbContext.BorrowBookRequests
            .Include(x => x.User)
            .Include(x => x.Book)
            .AsQueryable();

        if (query.Status.HasValue)
        {
            requests = requests.Where(x => x.Status == query.Status.Value);
        }

        var page = Math.Max(query.Page, 1);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);
        var totalItems = await requests.CountAsync();
        var results = await requests
            .OrderByDescending(x => x.BorrowedAt ?? DateTime.MinValue)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResultDto<BorrowBookResponseDto>
        {
            Items = results.Select(MapToResponse).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }

    public async Task<BorrowBookResponseDto> CreateAsync(Guid userId, CreateBorrowBookRequestDto request)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId && x.IsActive);
        if (user is null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        var normalizedIsbn = request.BookIsbn.Trim();
        var book = await dbContext.Books.FirstOrDefaultAsync(x => x.Isbn == normalizedIsbn && x.IsActive);
        if (book is null)
        {
            throw new KeyNotFoundException("Book not found.");
        }

        if (request.BorrowMode == BorrowMode.OFFLINE &&
            (book.Status == BookStatus.NOT_AVAILABLE || !book.AvailableCopies.HasValue || book.AvailableCopies.Value <= 0))
        {
            throw new InvalidOperationException("Book is out of stock.");
        }

        if (request.BorrowMode == BorrowMode.OFFLINE && !await bookHoldService.CanBorrowAsync(user.Id, book.Id))
        {
            throw new InvalidOperationException("Book is currently reserved for another user in the hold queue.");
        }

        var accessUrl = GetOnlineAccessUrl(book);
        if (request.BorrowMode == BorrowMode.ONLINE && string.IsNullOrWhiteSpace(accessUrl))
        {
            throw new InvalidOperationException("Online access is not available for this item.");
        }

        var borrowRequest = new BorrowBookRequest
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            User = user,
            BookId = book.Id,
            Book = book,
            BorrowMode = request.BorrowMode,
            Status = BookPendingStatus.APPROVED
        };

        SetBorrowDates(borrowRequest);

        if (request.BorrowMode == BorrowMode.OFFLINE)
        {
            book.AvailableCopies -= 1;
            ApplyAvailability(book);
            await bookHoldService.FulfillForBorrowAsync(user.Id, book.Id);
            borrowRequest.OfflineBorrowCode = await GenerateUniqueOfflineBorrowCodeAsync();
        }
        else
        {
            borrowRequest.OnlineAccessUrl = accessUrl;
        }

        dbContext.BorrowBookRequests.Add(borrowRequest);
        await dbContext.SaveChangesAsync();

        await SendBorrowNotificationAsync(user.Id, book.Title, borrowRequest);
        await gamificationService.RecordBookBorrowAsync(user.Id);

        logger.LogInformation("Created borrow request {RequestId} for user {UserId} and book {BookId}.", borrowRequest.Id, user.Id, book.Id);
        return MapToResponse(borrowRequest);
    }

    public async Task<BorrowBookResponseDto> ReturnAsync(Guid requestId, Guid userId)
    {
        var borrowRequest = await dbContext.BorrowBookRequests
            .Include(x => x.User)
            .Include(x => x.Book)
            .FirstOrDefaultAsync(x => x.Id == requestId && x.UserId == userId);

        if (borrowRequest is null)
        {
            throw new KeyNotFoundException("Borrow request not found.");
        }

        if (borrowRequest.Status != BookPendingStatus.APPROVED)
        {
            throw new InvalidOperationException("Only approved requests can be returned.");
        }

        if (borrowRequest.Book is null)
        {
            throw new InvalidOperationException("Book not found.");
        }

        borrowRequest.Status = BookPendingStatus.RETURNED;
        borrowRequest.ReturnedAt = DateTime.UtcNow;
        if (borrowRequest.BorrowMode == BorrowMode.OFFLINE)
        {
            borrowRequest.Book.AvailableCopies = (borrowRequest.Book.AvailableCopies ?? 0) + 1;
            ApplyAvailability(borrowRequest.Book);
        }

        await dbContext.SaveChangesAsync();
        if (borrowRequest.BorrowMode == BorrowMode.OFFLINE)
        {
            await bookHoldService.NotifyNextHoldAsync(borrowRequest.Book.Id);
        }

        logger.LogInformation("Returned borrow request {RequestId} for user {UserId}.", borrowRequest.Id, userId);
        return MapToResponse(borrowRequest);
    }

    private async Task SendBorrowNotificationAsync(Guid userId, string bookTitle, BorrowBookRequest borrowRequest)
    {
        if (borrowRequest.BorrowMode == BorrowMode.OFFLINE)
        {
            await notificationService.CreateAsync(
                userId,
                "Offline borrow code",
                $"Your offline borrow code for {bookTitle} is {borrowRequest.OfflineBorrowCode}. Bring this code to the librarian.",
                NotificationType.OFFLINE_BORROW_CODE);
            return;
        }

        await notificationService.CreateAsync(
            userId,
            "Online access ready",
            $"Your online access link for {bookTitle}: {borrowRequest.OnlineAccessUrl}",
            NotificationType.ONLINE_ACCESS);
    }

    private async Task<string> GenerateUniqueOfflineBorrowCodeAsync()
    {
        string code;
        do
        {
            code = GenerateOfflineBorrowCode();
        } while (await dbContext.BorrowBookRequests.AnyAsync(x => x.OfflineBorrowCode == code));

        return code;
    }

    private static string GenerateOfflineBorrowCode()
    {
        return new string(Enumerable.Range(0, 8)
            .Select(_ => CodeCharacters[Random.Shared.Next(CodeCharacters.Length)])
            .ToArray());
    }

    private static string? GetOnlineAccessUrl(Book book)
    {
        return book.DocumentType == DocumentType.DOCUMENT
            ? book.DocumentFileUrl ?? book.BookOnlineUrl
            : book.BookOnlineUrl ?? book.DocumentFileUrl;
    }

    public async Task<BorrowBookResponseDto> UpdateStatusAsync(Guid requestId, UpdateBorrowBookRequestDto request)
    {
        var borrowRequest = await dbContext.BorrowBookRequests
            .Include(x => x.User)
            .Include(x => x.Book)
            .FirstOrDefaultAsync(x => x.Id == requestId);

        if (borrowRequest is null)
        {
            throw new KeyNotFoundException("Borrow request not found.");
        }

        if (borrowRequest.Status != BookPendingStatus.PENDING)
        {
            throw new InvalidOperationException("Only pending requests can be reviewed.");
        }

        if (request.Status == BookPendingStatus.APPROVED)
        {
            if (borrowRequest.Book is null || !borrowRequest.Book.IsActive)
            {
                throw new InvalidOperationException("Book is no longer available.");
            }

            if (!borrowRequest.Book.AvailableCopies.HasValue || borrowRequest.Book.AvailableCopies.Value <= 0)
            {
                throw new InvalidOperationException("Book is out of stock.");
            }

            SetBorrowDates(borrowRequest);
            borrowRequest.Book.AvailableCopies -= 1;
            ApplyAvailability(borrowRequest.Book);

            if (borrowRequest.UserId.HasValue)
            {
                await notificationService.CreateAsync(
                    borrowRequest.UserId.Value,
                    "Borrow request approved",
                    $"Your request for {borrowRequest.Book.Title} was approved.",
                    NotificationType.BORROW_REQUEST);
            }
        }

        if (request.Status == BookPendingStatus.REJECT && borrowRequest.UserId.HasValue)
        {
            await notificationService.CreateAsync(
                borrowRequest.UserId.Value,
                "Borrow request rejected",
                $"Your request for {borrowRequest.Book?.Title ?? "a book"} was rejected.",
                NotificationType.BORROW_REQUEST);
        }

        borrowRequest.Status = request.Status;
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Updated borrow request {RequestId} to status {Status}.", borrowRequest.Id, borrowRequest.Status);
        return MapToResponse(borrowRequest);
    }

    private static void ApplyAvailability(Book book)
    {
        book.Status = book.AvailableCopies.HasValue && book.AvailableCopies.Value > 0
            ? BookStatus.AVAILABLE
            : BookStatus.NOT_AVAILABLE;
    }

    private static void SetBorrowDates(BorrowBookRequest request)
    {
        var borrowedAt = DateTime.UtcNow;
        request.BorrowedAt = borrowedAt;
        request.DueDate = borrowedAt.AddDays(BorrowPeriodDays);
        request.ReturnedAt = null;
    }

    private static BorrowBookResponseDto MapToResponse(BorrowBookRequest request)
    {
        var isOverdue = request.Status == BookPendingStatus.APPROVED
            && request.DueDate.HasValue
            && request.DueDate.Value < DateTime.UtcNow;

        return new BorrowBookResponseDto
        {
            Id = request.Id,
            UserId = request.UserId,
            UserName = request.User?.FullName ?? string.Empty,
            BookId = request.BookId,
            BookTitle = request.Book?.Title ?? string.Empty,
            BookIsbn = request.Book?.Isbn ?? string.Empty,
            UrlImage = request.Book?.ImageUrl,
            BorrowMode = request.BorrowMode,
            OfflineBorrowCode = request.OfflineBorrowCode,
            OnlineAccessUrl = request.OnlineAccessUrl,
            BorrowedAt = request.BorrowedAt,
            DueDate = request.DueDate,
            ReturnedAt = request.ReturnedAt,
            IsOverdue = isOverdue,
            WarningMessage = isOverdue ? "Book is overdue." : null,
            DocumentType = request.Book?.DocumentType ?? DocumentType.BOOK,
            Status = request.Status
        };
    }
}
