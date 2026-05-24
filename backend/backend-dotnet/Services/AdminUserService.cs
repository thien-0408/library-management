using backend_dotnet.Context;
using backend_dotnet.DTOs.AdminUsers;
using backend_dotnet.DTOs.Common;
using backend_dotnet.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services;

public class AdminUserService(
    LibraryManagementDbContext dbContext,
    ILogger<AdminUserService> logger) : IAdminUserService
{
    private readonly PasswordHasher<User> passwordHasher = new();

    public async Task<PagedResultDto<AdminUserResponseDto>> GetAllAsync(bool includeInactive, int page, int pageSize)
    {
        var query = dbContext.Users.AsQueryable();
        if (!includeInactive)
        {
            query = query.Where(x => x.IsActive);
        }

        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var totalItems = await query.CountAsync();
        var users = await query
            .OrderBy(x => x.Email)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResultDto<AdminUserResponseDto>
        {
            Items = users.Select(MapToResponse).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }

    public async Task<AdminUserResponseDto> GetByIdAsync(Guid id)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == id);
        if (user is null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        return MapToResponse(user);
    }

    public async Task<AdminUserResponseDto> CreateAsync(AdminCreateUserRequestDto request)
    {
        var email = request.Email.Trim();
        if (await dbContext.Users.AnyAsync(x => x.Email == email))
        {
            throw new InvalidOperationException("User already exists.");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            FullName = request.FullName.Trim(),
            Role = request.Role,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash = passwordHasher.HashPassword(user, request.Password);

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Admin created user {UserId}.", user.Id);
        return MapToResponse(user);
    }

    public async Task<AdminUserResponseDto> UpdateAsync(Guid id, Guid currentAdminId, AdminUpdateUserRequestDto request)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == id);
        if (user is null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            var email = request.Email.Trim();
            if (await dbContext.Users.AnyAsync(x => x.Email == email && x.Id != id))
            {
                throw new InvalidOperationException("User already exists.");
            }

            user.Email = email;
        }

        if (!string.IsNullOrWhiteSpace(request.FullName))
        {
            user.FullName = request.FullName.Trim();
        }

        if (request.Role.HasValue)
        {
            user.Role = request.Role.Value;
        }

        if (request.IsActive.HasValue)
        {
            if (!request.IsActive.Value)
            {
                await EnsureCanDeactivateAsync(user, currentAdminId);
            }

            user.IsActive = request.IsActive.Value;
        }

        await dbContext.SaveChangesAsync();

        logger.LogInformation("Admin updated user {UserId}.", user.Id);
        return MapToResponse(user);
    }

    public async Task SoftDeleteAsync(Guid id, Guid currentAdminId)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == id);
        if (user is null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        await EnsureCanDeactivateAsync(user, currentAdminId);

        user.IsActive = false;
        user.RefreshToken = null;
        user.TokenExpireTime = null;

        await dbContext.SaveChangesAsync();

        logger.LogInformation("Admin soft deleted user {UserId}.", user.Id);
    }

    private async Task EnsureCanDeactivateAsync(User user, Guid currentAdminId)
    {
        if (user.Id == currentAdminId)
        {
            throw new InvalidOperationException("You cannot deactivate your own account.");
        }

        if (user.Role == backend_dotnet.Enums.Role.ADMIN)
        {
            var activeAdminCount = await dbContext.Users.CountAsync(x => x.Role == backend_dotnet.Enums.Role.ADMIN && x.IsActive);
            if (activeAdminCount <= 1)
            {
                throw new InvalidOperationException("Cannot deactivate the last active admin.");
            }
        }
    }

    private static AdminUserResponseDto MapToResponse(User user)
    {
        return new AdminUserResponseDto
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            FullName = user.FullName ?? string.Empty,
            Role = user.Role,
            AvatarUrl = user.AvatarUrl,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt
        };
    }
}
