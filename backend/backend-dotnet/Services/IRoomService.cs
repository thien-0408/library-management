using backend_dotnet.DTOs.Rooms;

namespace backend_dotnet.Services;

public interface IRoomService
{
    Task<IReadOnlyList<RoomResponseDto>> GetAllAsync();
    Task<IReadOnlyList<RoomAvailabilityResponseDto>> GetAvailabilityAsync(Guid timeSlotId);
    Task<IReadOnlyList<RoomOccupancyResponseDto>> GetOccupancyAsync(Guid timeSlotId);
    Task<RoomResponseDto> CreateAsync(RoomRequestDto request);
    Task<RoomResponseDto> UpdateAsync(Guid id, RoomRequestDto request);
    Task DeleteAsync(Guid id);
}
