using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.DTOs.BookReviews;

public class CreateBookReviewRequestDto
{
    [Required]
    public string BookIsbn { get; set; } = string.Empty;

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }

    public string? Comment { get; set; }
}
