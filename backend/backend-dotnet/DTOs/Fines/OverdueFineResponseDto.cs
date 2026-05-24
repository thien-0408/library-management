using backend_dotnet.Enums;

namespace backend_dotnet.DTOs.Fines;

public class OverdueFineResponseDto
{
    public Guid Id { get; set; }
    public Guid BorrowBookRequestId { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string BookTitle { get; set; } = string.Empty;
    public string BookIsbn { get; set; } = string.Empty;
    public int OverdueDays { get; set; }
    public decimal Amount { get; set; }
    public FineStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}
