using backend_dotnet.Context;
using backend_dotnet.DTOs.Fines;
using backend_dotnet.Enums;
using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services;

public class FineService(
    LibraryManagementDbContext dbContext,
    INotificationService notificationService,
    ILogger<FineService> logger) : IFineService
{
    private const decimal FinePerDay = 5000m;

    public async Task<IReadOnlyList<OverdueFineResponseDto>> GetMyFinesAsync(Guid userId)
    {
        await GenerateOverdueFinesAsync();

        var fines = await BaseQuery()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return fines.Select(MapToResponse).ToList();
    }

    public async Task<IReadOnlyList<OverdueFineResponseDto>> GetAllAsync()
    {
        await GenerateOverdueFinesAsync();

        var fines = await BaseQuery()
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return fines.Select(MapToResponse).ToList();
    }

    public async Task<OverdueFineResponseDto> UpdateStatusAsync(Guid id, UpdateFineStatusRequestDto request)
    {
        var fine = await BaseQuery().FirstOrDefaultAsync(x => x.Id == id);
        if (fine is null)
        {
            throw new KeyNotFoundException("Fine not found.");
        }

        fine.Status = request.Status;
        fine.ResolvedAt = request.Status == FineStatus.UNPAID ? null : DateTime.UtcNow;
        await dbContext.SaveChangesAsync();

        await notificationService.CreateAsync(
            fine.UserId,
            "Fine status updated",
            $"Your overdue fine status is now {fine.Status}.",
            NotificationType.FINE);

        return MapToResponse(fine);
    }

    public async Task GenerateOverdueFinesAsync()
    {
        var overdueRequests = await dbContext.BorrowBookRequests
            .Include(x => x.Book)
            .Where(x => x.Status == BookPendingStatus.APPROVED && x.DueDate.HasValue && x.DueDate.Value < DateTime.UtcNow && x.UserId.HasValue)
            .ToListAsync();

        foreach (var request in overdueRequests)
        {
            var existingFine = await dbContext.OverdueFines.FirstOrDefaultAsync(x => x.BorrowBookRequestId == request.Id);
            var overdueDays = Math.Max(1, (DateTime.UtcNow.Date - request.DueDate!.Value.Date).Days);

            if (existingFine is not null)
            {
                if (existingFine.Status == FineStatus.UNPAID)
                {
                    existingFine.OverdueDays = overdueDays;
                    existingFine.Amount = overdueDays * FinePerDay;
                }

                continue;
            }

            var fine = new OverdueFine
            {
                Id = Guid.NewGuid(),
                BorrowBookRequestId = request.Id,
                UserId = request.UserId!.Value,
                OverdueDays = overdueDays,
                Amount = overdueDays * FinePerDay,
                Status = FineStatus.UNPAID,
                CreatedAt = DateTime.UtcNow
            };

            dbContext.OverdueFines.Add(fine);
            dbContext.Notifications.Add(new Notification
            {
                Id = Guid.NewGuid(),
                UserId = fine.UserId,
                Title = "Book is overdue",
                Message = $"{request.Book?.Title ?? "A borrowed book"} is overdue. Fine amount: {fine.Amount}.",
                Type = NotificationType.OVERDUE,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            });
        }

        await dbContext.SaveChangesAsync();
        logger.LogInformation("Generated overdue fines.");
    }

    private IQueryable<OverdueFine> BaseQuery()
    {
        return dbContext.OverdueFines
            .Include(x => x.User)
            .Include(x => x.BorrowBookRequest)
            .ThenInclude(x => x!.Book);
    }

    private static OverdueFineResponseDto MapToResponse(OverdueFine fine)
    {
        return new OverdueFineResponseDto
        {
            Id = fine.Id,
            BorrowBookRequestId = fine.BorrowBookRequestId,
            UserId = fine.UserId,
            UserName = fine.User?.FullName ?? string.Empty,
            BookTitle = fine.BorrowBookRequest?.Book?.Title ?? string.Empty,
            BookIsbn = fine.BorrowBookRequest?.Book?.Isbn ?? string.Empty,
            OverdueDays = fine.OverdueDays,
            Amount = fine.Amount,
            Status = fine.Status,
            CreatedAt = fine.CreatedAt,
            ResolvedAt = fine.ResolvedAt
        };
    }
}
