using backend_dotnet.DTOs.Auth;

namespace backend_dotnet.Services;

public interface IAuthService
{
    Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request);
    Task<RegisterResponseDto> GetProfileAsync(Guid userId);
    Task<RegisterResponseDto> UpdateProfileAsync(Guid userId, UpdateProfileRequestDto request);
    Task<ChangePasswordResponseDto> ChangePasswordAsync(Guid userId, ChangePasswordRequestDto request);
    Task<TokenResponseDto> LoginAsync(LoginRequestDto request);
    Task<TokenResponseDto> RefreshAsync(RefreshTokenRequestDto request);
    Task LogoutAsync(Guid userId);
}
