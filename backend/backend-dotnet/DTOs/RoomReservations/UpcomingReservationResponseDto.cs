namespace backend_dotnet.DTOs.RoomReservations;

public class UpcomingReservationResponseDto
{
    public Guid Id { get; set; }

    public Guid? RoomId { get; set; }

    public string RoomName { get; set; } = string.Empty;

    public Guid? TimeSlotId { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public DateOnly BookingDate { get; set; }

    public string? AccessCode { get; set; }
}
