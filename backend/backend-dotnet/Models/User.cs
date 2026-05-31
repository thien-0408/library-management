using backend_dotnet.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models;

[Table("users")]
public class User
{
    [Key]
    public Guid Id { get; set; }

    public string? Email { get; set; }

    public string? FullName { get; set; }

    public string? PasswordHash { get; set; }

    public Role Role { get; set; }

    public string? AvatarUrl { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime? CreatedAt { get; set; }

    public string? RefreshToken { get; set; }

    public DateTime? TokenExpireTime { get; set; }

    public ICollection<RoomReservation> Reservations { get; set; } = new List<RoomReservation>();

    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public ICollection<BookHold> BookHolds { get; set; } = new List<BookHold>();

    public ICollection<OverdueFine> OverdueFines { get; set; } = new List<OverdueFine>();

    public ICollection<BookReview> BookReviews { get; set; } = new List<BookReview>();

    public ICollection<ReadingList> ReadingLists { get; set; } = new List<ReadingList>();

    public ICollection<UserBadge> Badges { get; set; } = new List<UserBadge>();

    public UserPoints? Points { get; set; }
}
