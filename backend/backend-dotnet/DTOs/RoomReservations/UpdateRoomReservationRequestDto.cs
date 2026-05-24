using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.DTOs.RoomReservations;

public class UpdateRoomReservationRequestDto
{
    [Required]
    public DateOnly BookingDate { get; set; }

    [Required]
    public Guid RoomId { get; set; }

    [Required]
    public Guid TimeSlotId { get; set; }
}
