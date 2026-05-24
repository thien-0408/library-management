using backend_dotnet.Enums;

namespace backend_dotnet.DTOs.AdminUsers;

public class AdminCreateUserRequestDto
{
    public string Email { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public Role Role { get; set; } = Role.STUDENT;
}
