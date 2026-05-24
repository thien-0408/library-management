using backend_dotnet.Enums;

namespace backend_dotnet.DTOs.RoomReservations;

public class RoomReservationResponseDto
{
    public Guid Id { get; set; }

    public Guid? RoomId { get; set; }

    public Guid? UserId { get; set; }

    public Guid? TimeSlotId { get; set; }

    public DateOnly BookingDate { get; set; }

    public ReservationStatus ReservationStatus { get; set; }

    public string? AccessCode { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
