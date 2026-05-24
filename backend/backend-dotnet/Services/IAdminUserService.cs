using backend_dotnet.DTOs.AdminUsers;
using backend_dotnet.DTOs.Common;

namespace backend_dotnet.Services;

public interface IAdminUserService
{
    Task<PagedResultDto<AdminUserResponseDto>> GetAllAsync(bool includeInactive, int page, int pageSize);
    Task<AdminUserResponseDto> GetByIdAsync(Guid id);
    Task<AdminUserResponseDto> CreateAsync(AdminCreateUserRequestDto request);
    Task<AdminUserResponseDto> UpdateAsync(Guid id, Guid currentAdminId, AdminUpdateUserRequestDto request);
    Task SoftDeleteAsync(Guid id, Guid currentAdminId);
}
