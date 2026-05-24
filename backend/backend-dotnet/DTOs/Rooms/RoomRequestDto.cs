using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.DTOs.Rooms;

public class RoomRequestDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Range(0, int.MaxValue)]
    public int Capacity { get; set; }
}
