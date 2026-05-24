namespace backend_dotnet.DTOs.Auth;

public class UpdateProfileRequestDto
{
    public string? FullName { get; set; }

    public IFormFile? Avatar { get; set; }
}
