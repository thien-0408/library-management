using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.DTOs.Auth;

public class RegisterRequestDto
{
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    public IFormFile? Avatar { get; set; }
}
