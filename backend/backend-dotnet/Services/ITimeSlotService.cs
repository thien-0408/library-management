using backend_dotnet.DTOs.TimeSlots;

namespace backend_dotnet.Services;

public interface ITimeSlotService
{
    Task<IReadOnlyList<TimeSlotResponseDto>> GetAllAsync();
    Task<TimeSlotResponseDto> CreateAsync(TimeSlotRequestDto request);
    Task<TimeSlotResponseDto> UpdateAsync(Guid id, TimeSlotRequestDto request);
    Task DeleteAsync(Guid id);
    Task<int> DeleteExpiredUnusedAsync(CancellationToken cancellationToken = default);
}
