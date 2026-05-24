using backend_dotnet.Enums;

namespace backend_dotnet.DTOs.AdminUsers;

public class AdminUpdateUserRequestDto
{
    public string? Email { get; set; }

    public string? FullName { get; set; }

    public Role? Role { get; set; }

    public bool? IsActive { get; set; }
}
