using backend_dotnet.Enums;

namespace backend_dotnet.DTOs.Books;

public class GetBooksQueryDto
{
    public string? Isbn { get; set; }

    public string? Title { get; set; }

    public string? Author { get; set; }

    public BookCategory? Category { get; set; }

    public DocumentType? DocumentType { get; set; }

    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 20;
}
