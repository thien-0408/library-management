using backend_dotnet.DTOs.RoomReservations;

namespace backend_dotnet.Services;

public interface IRoomReservationService
{
    Task<RoomReservationResponseDto> CreateAsync(Guid userId, CreateRoomReservationRequestDto request);
    Task<RoomReservationResponseDto> UpdateAsync(Guid id, Guid currentUserId, bool isAdmin, UpdateRoomReservationRequestDto request);
    Task DeleteAsync(Guid id);
    Task<IReadOnlyList<RoomReservationResponseDto>> GetAllAsync();
    Task<IReadOnlyList<RoomReservationResponseDto>> GetMineAsync(Guid userId);
    Task<UpcomingReservationResponseDto?> GetUpcomingAsync(Guid userId);
    Task ConfirmAsync(Guid id, Guid currentUserId, bool isAdmin);
    Task CancelAsync(Guid id, Guid currentUserId, bool isAdmin);
}
