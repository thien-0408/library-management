namespace backend_dotnet.DTOs.Gamification;

public class LeaderboardEntryDto
{
    public int Rank { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public int TotalPoints { get; set; }
    public int BooksRead { get; set; }
    public int BadgeCount { get; set; }
}
