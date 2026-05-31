using backend_dotnet.DTOs.BookReviews;

namespace backend_dotnet.Services;

public interface IBookReviewService
{
    Task<IReadOnlyList<BookReviewResponseDto>> GetByBookIdAsync(Guid bookId);
    Task<IReadOnlyList<BookReviewResponseDto>> GetMyReviewsAsync(Guid userId);
    Task<BookReviewResponseDto> CreateAsync(Guid userId, CreateBookReviewRequestDto request);
    Task<BookReviewResponseDto> UpdateAsync(Guid userId, Guid reviewId, UpdateBookReviewRequestDto request);
    Task DeleteAsync(Guid userId, Guid reviewId);
    Task<BookRatingSummaryDto> GetRatingSummaryAsync(Guid bookId);
}
