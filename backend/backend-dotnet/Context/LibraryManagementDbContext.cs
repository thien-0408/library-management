using backend_dotnet.Enums;
using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Context;

public class LibraryManagementDbContext(DbContextOptions<LibraryManagementDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Book> Books => Set<Book>();
    public DbSet<BorrowBookRequest> BorrowBookRequests => Set<BorrowBookRequest>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<RoomReservation> RoomReservations => Set<RoomReservation>();
    public DbSet<TimeSlot> TimeSlots => Set<TimeSlot>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<OverdueFine> OverdueFines => Set<OverdueFine>();
    public DbSet<BookHold> BookHolds => Set<BookHold>();
    public DbSet<BookReview> BookReviews => Set<BookReview>();
    public DbSet<ReadingList> ReadingLists => Set<ReadingList>();
    public DbSet<ReadingListItem> ReadingListItems => Set<ReadingListItem>();
    public DbSet<UserBadge> UserBadges => Set<UserBadge>();
    public DbSet<UserPoints> UserPoints => Set<UserPoints>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(x => x.Email)
            .IsUnique();

        modelBuilder.Entity<Room>()
            .HasIndex(x => x.Name)
            .IsUnique();

        modelBuilder.Entity<RoomReservation>()
            .HasIndex(x => new { x.RoomId, x.TimeSlotId, x.BookingDate, x.UserId })
            .IsUnique();

        modelBuilder.Entity<RoomReservation>()
            .HasIndex(x => x.AccessCode)
            .IsUnique()
            .HasFilter("[AccessCode] IS NOT NULL");

        modelBuilder.Entity<Book>()
            .Property(x => x.Status)
            .HasConversion<string>();

        modelBuilder.Entity<Book>()
            .Property(x => x.Category)
            .HasConversion<string>();

        modelBuilder.Entity<Book>()
            .Property(x => x.DocumentType)
            .HasConversion<string>();

        modelBuilder.Entity<BorrowBookRequest>()
            .Property(x => x.BorrowMode)
            .HasConversion<string>()
            .HasColumnType("varchar(20)");

        modelBuilder.Entity<BorrowBookRequest>()
            .HasIndex(x => x.OfflineBorrowCode)
            .IsUnique()
            .HasFilter("[OfflineBorrowCode] IS NOT NULL");

        modelBuilder.Entity<BorrowBookRequest>()
            .Property(x => x.Status)
            .HasConversion<string>();

        modelBuilder.Entity<RoomReservation>()
            .Property(x => x.ReservationStatus)
            .HasConversion<string>();

        modelBuilder.Entity<User>()
            .Property(x => x.Role)
            .HasConversion<string>()
            .HasColumnType("varchar(20)");

        modelBuilder.Entity<Notification>()
            .Property(x => x.Type)
            .HasConversion<string>()
            .HasColumnType("varchar(30)");

        modelBuilder.Entity<OverdueFine>()
            .Property(x => x.Status)
            .HasConversion<string>()
            .HasColumnType("varchar(20)");

        modelBuilder.Entity<OverdueFine>()
            .Property(x => x.Amount)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<BookHold>()
            .Property(x => x.Status)
            .HasConversion<string>()
            .HasColumnType("varchar(20)");

        modelBuilder.Entity<BookHold>()
            .HasIndex(x => new { x.UserId, x.BookId, x.Status });

        modelBuilder.Entity<TimeSlot>()
            .Property(x => x.StartTime)
            .HasColumnType("time");

        modelBuilder.Entity<TimeSlot>()
            .Property(x => x.EndTime)
            .HasColumnType("time");

        modelBuilder.Entity<BookReview>()
            .HasIndex(x => new { x.UserId, x.BookId })
            .IsUnique();

        modelBuilder.Entity<ReadingList>()
            .Property(x => x.ListType)
            .HasConversion<string>()
            .HasColumnType("varchar(20)");

        modelBuilder.Entity<ReadingListItem>()
            .HasIndex(x => new { x.ReadingListId, x.BookId })
            .IsUnique();

        modelBuilder.Entity<UserBadge>()
            .Property(x => x.BadgeType)
            .HasConversion<string>()
            .HasColumnType("varchar(30)");
    }
}
