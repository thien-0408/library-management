namespace backend_dotnet.DTOs.Gamification;

public class UserPointsResponseDto
{
    public int TotalPoints { get; set; }
    public int BooksRead { get; set; }
    public int ReviewsWritten { get; set; }
    public int CurrentStreak { get; set; }
    public int LongestStreak { get; set; }
    public DateTime? LastActivityDate { get; set; }
}
