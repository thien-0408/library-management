using backend_dotnet.Context;
using backend_dotnet.DTOs.Admin;
using backend_dotnet.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services;

public class AdminDashboardService(LibraryManagementDbContext dbContext, IFineService fineService) : IAdminDashboardService
{
    public async Task<DashboardStatsResponseDto> GetStatsAsync()
    {
        await fineService.GenerateOverdueFinesAsync();

        var today = DateOnly.FromDateTime(DateTime.Now);

        return new DashboardStatsResponseDto
        {
            ActiveUsers = await dbContext.Users.CountAsync(x => x.IsActive),
            TotalBooks = await dbContext.Books.CountAsync(),
            BorrowedBooks = await dbContext.BorrowBookRequests.CountAsync(x => x.Status == BookPendingStatus.APPROVED),
            OverdueBooks = await dbContext.BorrowBookRequests.CountAsync(x => x.Status == BookPendingStatus.APPROVED && x.DueDate.HasValue && x.DueDate.Value < DateTime.UtcNow),
            PendingBorrowRequests = await dbContext.BorrowBookRequests.CountAsync(x => x.Status == BookPendingStatus.PENDING),
            WaitingBookHolds = await dbContext.BookHolds.CountAsync(x => x.Status == BookHoldStatus.WAITING || x.Status == BookHoldStatus.NOTIFIED),
            UnpaidFines = await dbContext.OverdueFines.CountAsync(x => x.Status == FineStatus.UNPAID),
            UnpaidFineAmount = await dbContext.OverdueFines.Where(x => x.Status == FineStatus.UNPAID).SumAsync(x => x.Amount),
            RoomReservationsToday = await dbContext.RoomReservations.CountAsync(x => x.BookingDate == today)
        };
    }
}
