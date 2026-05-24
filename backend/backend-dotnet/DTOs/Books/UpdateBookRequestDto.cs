using backend_dotnet.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.DTOs.Books;

public class UpdateBookRequestDto
{
    public string? Title { get; set; }

    public string? Author { get; set; }

    [Range(1, int.MaxValue)]
    public int? YearOfPublication { get; set; }

    public BookCategory? Category { get; set; }

    [Range(0, int.MaxValue)]
    public int? AvailableCopies { get; set; }

    public IFormFile? Image { get; set; }

    public string? BookOnlineUrl { get; set; }

    public IFormFile? DocumentFile { get; set; }

    public DocumentType? DocumentType { get; set; }
}
