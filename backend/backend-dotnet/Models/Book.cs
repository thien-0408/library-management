using backend_dotnet.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models;

[Table("books")]
public class Book
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Author { get; set; }

    public string? Isbn { get; set; }

    public int? YearOfPublication { get; set; }

    [Required]
    public BookCategory Category { get; set; }

    public int? AvailableCopies { get; set; }

    public string? ImageUrl { get; set; }

    public string? BookOnlineUrl { get; set; }

    public string? DocumentFileUrl { get; set; }

    [Required]
    public BookStatus Status { get; set; }

    [Required]
    public DocumentType DocumentType { get; set; }

    public ICollection<BorrowBookRequest> PendingRequests { get; set; } = new List<BorrowBookRequest>();

    public ICollection<BookHold> Holds { get; set; } = new List<BookHold>();

    public ICollection<BookReview> Reviews { get; set; } = new List<BookReview>();
}
