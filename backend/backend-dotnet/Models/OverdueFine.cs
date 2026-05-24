using backend_dotnet.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models;

[Table("overdue_fines")]
public class OverdueFine
{
    [Key]
    public Guid Id { get; set; }

    public Guid BorrowBookRequestId { get; set; }
    [ForeignKey(nameof(BorrowBookRequestId))]
    public BorrowBookRequest? BorrowBookRequest { get; set; }

    public Guid UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    public int OverdueDays { get; set; }

    public decimal Amount { get; set; }

    public FineStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? ResolvedAt { get; set; }
}
