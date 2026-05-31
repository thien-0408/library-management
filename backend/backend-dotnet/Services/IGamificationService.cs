using backend_dotnet.DTOs.Gamification;

namespace backend_dotnet.Services;

public interface IGamificationService
{
    Task<UserGamificationProfileDto> GetMyProfileAsync(Guid userId);
    Task<IReadOnlyList<LeaderboardEntryDto>> GetLeaderboardAsync(int top);
    Task RecordBookBorrowAsync(Guid userId);
    Task RecordReviewAsync(Guid userId);
    Task RecordRoomReservationAsync(Guid userId);
}
