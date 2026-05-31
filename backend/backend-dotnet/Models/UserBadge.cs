using backend_dotnet.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models;

[Table("user_badges")]
public class UserBadge
{
    [Key]
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    public BadgeType BadgeType { get; set; }

    public string BadgeName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int PointsAwarded { get; set; }

    public DateTime EarnedAt { get; set; }
}
