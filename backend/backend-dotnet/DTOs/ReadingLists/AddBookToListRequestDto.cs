using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.DTOs.ReadingLists;

public class AddBookToListRequestDto
{
    [Required]
    public string BookIsbn { get; set; } = string.Empty;

    public string? Notes { get; set; }
}
