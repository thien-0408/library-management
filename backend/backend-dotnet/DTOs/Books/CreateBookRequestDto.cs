using backend_dotnet.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.DTOs.Books;

public class CreateBookRequestDto
{
    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Author { get; set; }

    [Required]
    public string Isbn { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int? YearOfPublication { get; set; }

    [Required]
    public BookCategory Category { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int AvailableCopies { get; set; }

    public IFormFile? Image { get; set; }

    public string? BookOnlineUrl { get; set; }

    public IFormFile? DocumentFile { get; set; }

    [Required]
    public DocumentType DocumentType { get; set; }
}
