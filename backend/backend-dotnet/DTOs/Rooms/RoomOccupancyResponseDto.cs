namespace backend_dotnet.DTOs.Rooms;

public class RoomOccupancyResponseDto
{
    public Guid RoomId { get; set; }

    public string RoomName { get; set; } = string.Empty;

    public int Capacity { get; set; }

    public int BookedCount { get; set; }
}
