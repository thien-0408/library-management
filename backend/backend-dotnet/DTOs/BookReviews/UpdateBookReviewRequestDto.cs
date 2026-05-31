using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.DTOs.BookReviews;

public class UpdateBookReviewRequestDto
{
    [Range(1, 5)]
    public int? Rating { get; set; }

    public string? Comment { get; set; }
}
