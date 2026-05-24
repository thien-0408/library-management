using backend_dotnet.DTOs.BookHolds;

namespace backend_dotnet.Services;

public interface IBookHoldService
{
    Task<IReadOnlyList<BookHoldResponseDto>> GetMyHoldsAsync(Guid userId);
    Task<IReadOnlyList<BookHoldResponseDto>> GetAllAsync();
    Task<BookHoldResponseDto> CreateAsync(Guid userId, CreateBookHoldRequestDto request);
    Task CancelAsync(Guid userId, Guid holdId, bool isAdmin);
    Task NotifyNextHoldAsync(Guid bookId);
    Task<bool> CanBorrowAsync(Guid userId, Guid bookId);
    Task FulfillForBorrowAsync(Guid userId, Guid bookId);
}
