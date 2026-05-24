using backend_dotnet.DTOs.Books;
using backend_dotnet.DTOs.Common;

namespace backend_dotnet.Services;

public interface IBookService
{
    Task<BookResponseDto> GetByIdAsync(Guid id);
    Task<PagedResultDto<BookResponseDto>> SearchAsync(GetBooksQueryDto query);
    Task<BookResponseDto> CreateAsync(CreateBookRequestDto request);
    Task<BookResponseDto> UpdateByIsbnAsync(string isbn, UpdateBookRequestDto request);
    Task DeleteByIsbnAsync(string isbn);
}
