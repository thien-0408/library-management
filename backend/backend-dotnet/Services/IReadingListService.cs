using backend_dotnet.DTOs.ReadingLists;

namespace backend_dotnet.Services;

public interface IReadingListService
{
    Task<IReadOnlyList<ReadingListResponseDto>> GetMyListsAsync(Guid userId);
    Task<ReadingListDetailResponseDto> GetByIdAsync(Guid userId, Guid listId);
    Task<ReadingListResponseDto> CreateAsync(Guid userId, CreateReadingListRequestDto request);
    Task<ReadingListResponseDto> UpdateAsync(Guid userId, Guid listId, UpdateReadingListRequestDto request);
    Task DeleteAsync(Guid userId, Guid listId);
    Task<ReadingListItemResponseDto> AddBookAsync(Guid userId, Guid listId, AddBookToListRequestDto request);
    Task RemoveBookAsync(Guid userId, Guid listId, Guid itemId);
}
