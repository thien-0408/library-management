namespace backend_dotnet.DTOs.Gamification;

public class UserGamificationProfileDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public UserPointsResponseDto Points { get; set; } = new();
    public IReadOnlyList<UserBadgeResponseDto> Badges { get; set; } = [];
}
