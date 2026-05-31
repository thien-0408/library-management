using backend_dotnet.Enums;

namespace backend_dotnet.DTOs.Books;

public class BookResponseDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Author { get; set; }

    public string? Isbn { get; set; }

    public int? YearOfPublication { get; set; }

    public BookCategory Category { get; set; }

    public int? AvailableCopies { get; set; }

    public string? ImageUrl { get; set; }

    public string? BookOnlineUrl { get; set; }

    public string? DocumentFileUrl { get; set; }

    public BookStatus Status { get; set; }

    public DocumentType DocumentType { get; set; }

    public double? AverageRating { get; set; }

    public int TotalReviews { get; set; }
}
