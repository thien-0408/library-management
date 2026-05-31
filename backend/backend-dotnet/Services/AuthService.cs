using backend_dotnet.Context;
using backend_dotnet.DTOs.Auth;
using backend_dotnet.Enums;
using backend_dotnet.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace backend_dotnet.Services;

public class AuthService(
    LibraryManagementDbContext dbContext,
    IConfiguration configuration,
    IFileService fileService,
    ILogger<AuthService> logger) : IAuthService
{
    private readonly PasswordHasher<User> passwordHasher = new();

    public async Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        var email = request.Email.Trim();

        if (await dbContext.Users.AnyAsync(x => x.Email == email))
        {
            logger.LogWarning("Register failed because email {Email} already exists.", email);
            throw new InvalidOperationException("User already exists.");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            FullName = request.FullName.Trim(),
            Role = Role.STUDENT,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        if (request.Avatar is not null)
        {
            user.AvatarUrl = await fileService.SaveFileAsync(request.Avatar, "avatars");
        }

        user.PasswordHash = passwordHasher.HashPassword(user, request.Password);

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Registered user {Email}.", user.Email);

        return new RegisterResponseDto
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            FullName = user.FullName ?? string.Empty,
            Role = user.Role.ToString(),
            AvatarUrl = user.AvatarUrl
        };
    }

    public async Task<RegisterResponseDto> GetProfileAsync(Guid userId)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId && x.IsActive);
        if (user is null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        return MapToRegisterResponse(user);
    }

    public async Task<RegisterResponseDto> UpdateProfileAsync(Guid userId, UpdateProfileRequestDto request)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId && x.IsActive);
        if (user is null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        if (!string.IsNullOrWhiteSpace(request.FullName))
        {
            user.FullName = request.FullName.Trim();
        }

        if (request.Avatar is not null)
        {
            user.AvatarUrl = await fileService.SaveFileAsync(request.Avatar, "avatars");
        }

        await dbContext.SaveChangesAsync();

        logger.LogInformation("Updated profile for user {UserId}.", user.Id);

        return MapToRegisterResponse(user);
    }

    public async Task<ChangePasswordResponseDto> ChangePasswordAsync(Guid userId, ChangePasswordRequestDto request)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId && x.IsActive);
        if (user is null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        var verifyResult = passwordHasher.VerifyHashedPassword(user, user.PasswordHash ?? string.Empty, request.CurrentPassword);
        if (verifyResult == PasswordVerificationResult.Failed)
        {
            throw new UnauthorizedAccessException("Mật khẩu hiện tại không chính xác.");
        }

        user.PasswordHash = passwordHasher.HashPassword(user, request.NewPassword);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("User {UserId} changed password successfully.", user.Id);

        return new ChangePasswordResponseDto
        {
            Message = "Đổi mật khẩu thành công."
        };
    }

    private static RegisterResponseDto MapToRegisterResponse(User user)
    {
        return new RegisterResponseDto
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            FullName = user.FullName ?? string.Empty,
            Role = user.Role.ToString(),
            AvatarUrl = user.AvatarUrl
        };
    }


    public async Task<TokenResponseDto> LoginAsync(LoginRequestDto request)
    {
        var email = request.Email.Trim();
        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Email == email && x.IsActive);

        if (user is null)
        {
            logger.LogWarning("Login failed because user {Email} was not found or inactive.", email);
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        var verifyResult = passwordHasher.VerifyHashedPassword(user, user.PasswordHash ?? string.Empty, request.Password);
        if (verifyResult == PasswordVerificationResult.Failed)
        {
            logger.LogWarning("Login failed because password did not match for {Email}.", email);
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        var refreshToken = GenerateRefreshToken();
        user.RefreshToken = HashRefreshToken(refreshToken);
        user.TokenExpireTime = DateTime.UtcNow.AddDays(1);

        await dbContext.SaveChangesAsync();

        logger.LogInformation("User {Email} logged in.", user.Email);

        return new TokenResponseDto
        {
            AccessToken = CreateToken(user),
            RefreshToken = refreshToken
        };
    }

    public async Task<TokenResponseDto> RefreshAsync(RefreshTokenRequestDto request)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(x =>
            x.RefreshToken == HashRefreshToken(request.RefreshToken) &&
            x.TokenExpireTime > DateTime.UtcNow &&
            x.IsActive);

        if (user is null)
        {
            throw new UnauthorizedAccessException("Invalid refresh token.");
        }

        var refreshToken = GenerateRefreshToken();
        user.RefreshToken = HashRefreshToken(refreshToken);
        user.TokenExpireTime = DateTime.UtcNow.AddDays(1);
        await dbContext.SaveChangesAsync();

        return new TokenResponseDto
        {
            AccessToken = CreateToken(user),
            RefreshToken = refreshToken
        };
    }

    public async Task LogoutAsync(Guid userId)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId);
        if (user is null)
        {
            return;
        }

        user.RefreshToken = null;
        user.TokenExpireTime = null;
        await dbContext.SaveChangesAsync();
    }

    private string CreateToken(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.FullName ?? user.Email ?? user.Id.ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Role, user.Role.ToString()),
            new(ClaimTypes.Email, user.Email ?? string.Empty)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(configuration.GetValue<string>("AppSettings:Token")!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
        var tokenDescriptor = new JwtSecurityToken(
            issuer: configuration.GetValue<string>("AppSettings:Issuer"),
            audience: configuration.GetValue<string>("AppSettings:Audience"),
            claims: claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }

    private static string GenerateRefreshToken()
    {
        var randomBytes = RandomNumberGenerator.GetBytes(64);
        return Base64UrlEncoder.Encode(randomBytes);
    }

    private static string HashRefreshToken(string refreshToken)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(refreshToken));
        return Convert.ToHexString(bytes);
    }
}
