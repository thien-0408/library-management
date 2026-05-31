using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models;

[Table("user_points")]
public class UserPoints
{
    [Key]
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    public int TotalPoints { get; set; }

    public int BooksRead { get; set; }

    public int ReviewsWritten { get; set; }

    public int CurrentStreak { get; set; }

    public int LongestStreak { get; set; }

    public DateTime? LastActivityDate { get; set; }

    public DateTime UpdatedAt { get; set; }
}
