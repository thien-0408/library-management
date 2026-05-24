namespace backend_dotnet.DTOs.TimeSlots;

public class TimeSlotResponseDto
{
    public Guid Id { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
