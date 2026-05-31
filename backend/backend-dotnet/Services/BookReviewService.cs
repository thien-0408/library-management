using backend_dotnet.Context;
using backend_dotnet.DTOs.BookReviews;
using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services;

public class BookReviewService(
    LibraryManagementDbContext dbContext,
    IGamificationService gamificationService,
    ILogger<BookReviewService> logger) : IBookReviewService
{
    public async Task<IReadOnlyList<BookReviewResponseDto>> GetByBookIdAsync(Guid bookId)
    {
        var reviews = await dbContext.BookReviews
            .Include(x => x.User)
            .Include(x => x.Book)
            .Where(x => x.BookId == bookId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return reviews.Select(MapToResponse).ToList();
    }

    public async Task<IReadOnlyList<BookReviewResponseDto>> GetMyReviewsAsync(Guid userId)
    {
        var reviews = await dbContext.BookReviews
            .Include(x => x.User)
            .Include(x => x.Book)
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return reviews.Select(MapToResponse).ToList();
    }

    public async Task<BookReviewResponseDto> CreateAsync(Guid userId, CreateBookReviewRequestDto request)
    {
        var normalizedIsbn = request.BookIsbn.Trim();
        var book = await dbContext.Books.FirstOrDefaultAsync(x => x.Isbn == normalizedIsbn);
        if (book is null)
        {
            throw new KeyNotFoundException("Book not found.");
        }

        var existingReview = await dbContext.BookReviews
            .AnyAsync(x => x.UserId == userId && x.BookId == book.Id);
        if (existingReview)
        {
            throw new InvalidOperationException("You have already reviewed this book.");
        }

        var review = new BookReview
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            BookId = book.Id,
            Rating = request.Rating,
            Comment = request.Comment?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        dbContext.BookReviews.Add(review);
        await dbContext.SaveChangesAsync();

        await gamificationService.RecordReviewAsync(userId);

        // Reload with navigation properties
        await dbContext.Entry(review).Reference(x => x.User).LoadAsync();
        await dbContext.Entry(review).Reference(x => x.Book).LoadAsync();

        logger.LogInformation("User {UserId} reviewed book {BookId} with rating {Rating}.", userId, book.Id, request.Rating);
        return MapToResponse(review);
    }

    public async Task<BookReviewResponseDto> UpdateAsync(Guid userId, Guid reviewId, UpdateBookReviewRequestDto request)
    {
        var review = await dbContext.BookReviews
            .Include(x => x.User)
            .Include(x => x.Book)
            .FirstOrDefaultAsync(x => x.Id == reviewId && x.UserId == userId);

        if (review is null)
        {
            throw new KeyNotFoundException("Review not found.");
        }

        if (request.Rating.HasValue)
        {
            review.Rating = request.Rating.Value;
        }

        if (request.Comment is not null)
        {
            review.Comment = request.Comment.Trim();
        }

        review.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();

        logger.LogInformation("User {UserId} updated review {ReviewId}.", userId, reviewId);
        return MapToResponse(review);
    }

    public async Task DeleteAsync(Guid userId, Guid reviewId)
    {
        var review = await dbContext.BookReviews
            .FirstOrDefaultAsync(x => x.Id == reviewId && x.UserId == userId);

        if (review is null)
        {
            throw new KeyNotFoundException("Review not found.");
        }

        dbContext.BookReviews.Remove(review);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("User {UserId} deleted review {ReviewId}.", userId, reviewId);
    }

    public async Task<BookRatingSummaryDto> GetRatingSummaryAsync(Guid bookId)
    {
        var reviews = await dbContext.BookReviews
            .Where(x => x.BookId == bookId)
            .ToListAsync();

        return new BookRatingSummaryDto
        {
            AverageRating = reviews.Count > 0 ? Math.Round(reviews.Average(x => x.Rating), 1) : 0,
            TotalReviews = reviews.Count
        };
    }

    private static BookReviewResponseDto MapToResponse(BookReview review)
    {
        return new BookReviewResponseDto
        {
            Id = review.Id,
            UserId = review.UserId,
            UserName = review.User?.FullName ?? string.Empty,
            UserAvatarUrl = review.User?.AvatarUrl,
            BookId = review.BookId,
            BookTitle = review.Book?.Title ?? string.Empty,
            BookIsbn = review.Book?.Isbn,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt,
            UpdatedAt = review.UpdatedAt
        };
    }
}
