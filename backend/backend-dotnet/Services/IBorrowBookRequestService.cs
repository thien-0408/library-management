using backend_dotnet.DTOs.BorrowBooks;
using backend_dotnet.DTOs.Common;
using backend_dotnet.Enums;

namespace backend_dotnet.Services;

public interface IBorrowBookRequestService
{
    Task<IReadOnlyList<BorrowBookResponseDto>> GetMyRequestsAsync(Guid userId);
    Task<PagedResultDto<BorrowBookResponseDto>> GetAllAsync(GetBorrowBookRequestsQueryDto query);
    Task<BorrowBookResponseDto> CreateAsync(Guid userId, CreateBorrowBookRequestDto request);
    Task<BorrowBookResponseDto> ReturnAsync(Guid requestId, Guid userId);
    Task<BorrowBookResponseDto> UpdateStatusAsync(Guid requestId, UpdateBorrowBookRequestDto request);
}
