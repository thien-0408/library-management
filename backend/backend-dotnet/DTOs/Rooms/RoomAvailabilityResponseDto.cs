namespace backend_dotnet.DTOs.Rooms;

public class RoomAvailabilityResponseDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int Capacity { get; set; }

    public int SeatsLeft { get; set; }

    public bool IsFull { get; set; }
}
