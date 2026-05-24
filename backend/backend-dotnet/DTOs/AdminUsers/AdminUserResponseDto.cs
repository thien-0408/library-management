using backend_dotnet.Enums;

namespace backend_dotnet.DTOs.AdminUsers;

public class AdminUserResponseDto
{
    public Guid Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public Role Role { get; set; }

    public string? AvatarUrl { get; set; }

    public bool IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }
}
