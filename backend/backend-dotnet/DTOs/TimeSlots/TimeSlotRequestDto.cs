using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.DTOs.TimeSlots;

public class TimeSlotRequestDto
{
    [Required]
    public TimeOnly StartTime { get; set; }

    [Required]
    public TimeOnly EndTime { get; set; }
}
