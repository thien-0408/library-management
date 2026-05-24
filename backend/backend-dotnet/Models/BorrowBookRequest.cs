using backend_dotnet.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models;

[Table("borrowBookRequest")]
public class BorrowBookRequest
{
    [Key]
    public Guid Id { get; set; }

    [Column("user_id")]
    public Guid? UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    [Column("book_id")]
    public Guid? BookId { get; set; }

    [ForeignKey(nameof(BookId))]
    public Book? Book { get; set; }

    public BookPendingStatus Status { get; set; }

    public BorrowMode BorrowMode { get; set; }

    public string? OfflineBorrowCode { get; set; }

    public string? OnlineAccessUrl { get; set; }

    public DateTime? BorrowedAt { get; set; }

    public DateTime? DueDate { get; set; }

    public DateTime? ReturnedAt { get; set; }

    public ICollection<OverdueFine> OverdueFines { get; set; } = new List<OverdueFine>();
}
