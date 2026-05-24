using backend_dotnet.Enums;

namespace backend_dotnet.DTOs.BorrowBooks;

public class BorrowBookResponseDto
{
    public Guid Id { get; set; }

    public Guid? UserId { get; set; }

    public string UserName { get; set; } = string.Empty;

    public Guid? BookId { get; set; }

    public string BookTitle { get; set; } = string.Empty;

    public string BookIsbn { get; set; } = string.Empty;

    public string? UrlImage { get; set; }

    public BorrowMode BorrowMode { get; set; }

    public string? OfflineBorrowCode { get; set; }

    public string? OnlineAccessUrl { get; set; }

    public DateTime? BorrowedAt { get; set; }

    public DateTime? DueDate { get; set; }

    public DateTime? ReturnedAt { get; set; }

    public bool IsOverdue { get; set; }

    public string? WarningMessage { get; set; }

    public DocumentType DocumentType { get; set; }

    public BookPendingStatus Status { get; set; }
}
