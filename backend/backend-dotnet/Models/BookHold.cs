using backend_dotnet.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models;

[Table("book_holds")]
public class BookHold
{
    [Key]
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    public Guid BookId { get; set; }
    [ForeignKey(nameof(BookId))]
    public Book? Book { get; set; }

    public BookHoldStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? NotifiedAt { get; set; }
}
