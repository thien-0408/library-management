using backend_dotnet.DTOs.Admin;

namespace backend_dotnet.Services;

public interface IAdminDashboardService
{
    Task<DashboardStatsResponseDto> GetStatsAsync();
}
