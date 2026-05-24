using backend_dotnet.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models;

[Table("room_reservations")]
public class RoomReservation
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public ReservationStatus ReservationStatus { get; set; }

    [Required]
    public DateOnly BookingDate { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? AccessCode { get; set; }

    [Column("room_id")]
    public Guid? RoomId { get; set; }

    [ForeignKey(nameof(RoomId))]
    public Room? Room { get; set; }

    [Column("timeslot_id")]
    public Guid? TimeSlotId { get; set; }

    [ForeignKey(nameof(TimeSlotId))]
    public TimeSlot? TimeSlot { get; set; }

    [Column("user_id")]
    public Guid? UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }
}
