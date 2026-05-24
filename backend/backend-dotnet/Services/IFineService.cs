using backend_dotnet.DTOs.Fines;

namespace backend_dotnet.Services;

public interface IFineService
{
    Task<IReadOnlyList<OverdueFineResponseDto>> GetMyFinesAsync(Guid userId);
    Task<IReadOnlyList<OverdueFineResponseDto>> GetAllAsync();
    Task<OverdueFineResponseDto> UpdateStatusAsync(Guid id, UpdateFineStatusRequestDto request);
    Task GenerateOverdueFinesAsync();
}
