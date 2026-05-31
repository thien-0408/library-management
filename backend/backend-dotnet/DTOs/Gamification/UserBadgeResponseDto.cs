using backend_dotnet.Enums;

namespace backend_dotnet.DTOs.Gamification;

public class UserBadgeResponseDto
{
    public Guid Id { get; set; }
    public BadgeType BadgeType { get; set; }
    public string BadgeName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int PointsAwarded { get; set; }
    public DateTime EarnedAt { get; set; }
}
