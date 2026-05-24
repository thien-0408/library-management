using backend_dotnet.Context;
using backend_dotnet.DTOs.RoomReservations;
using backend_dotnet.Enums;
using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services;

public class RoomReservationService(
    LibraryManagementDbContext dbContext,
    INotificationService notificationService,
    ILogger<RoomReservationService> logger) : IRoomReservationService
{
    private static readonly char[] CodeCharacters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".ToCharArray();

    public async Task<RoomReservationResponseDto> CreateAsync(Guid userId, CreateRoomReservationRequestDto request)
    {
        var room = await dbContext.Rooms.FirstOrDefaultAsync(x => x.Id == request.RoomId);
        if (room is null)
        {
            throw new KeyNotFoundException("Room not found.");
        }

        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId && x.IsActive);
        if (user is null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        var timeSlot = await dbContext.TimeSlots.FirstOrDefaultAsync(x => x.Id == request.TimeSlotId);
        if (timeSlot is null)
        {
            throw new KeyNotFoundException("Time slot not found.");
        }

        ValidateBookingDate(request.BookingDate, timeSlot.StartTime);

        var hasDuplicate = await dbContext.RoomReservations.AnyAsync(x =>
            x.UserId == user.Id &&
            x.TimeSlotId == timeSlot.Id &&
            x.BookingDate == request.BookingDate);
        if (hasDuplicate)
        {
            throw new InvalidOperationException("User already booked this time slot on this date.");
        }

        var currentBooked = await dbContext.RoomReservations.CountAsync(x =>
            x.RoomId == room.Id &&
            x.TimeSlotId == timeSlot.Id &&
            x.BookingDate == request.BookingDate &&
            x.ReservationStatus == ReservationStatus.SCHEDULING);
        if (currentBooked >= room.Capacity)
        {
            throw new InvalidOperationException("Room is full.");
        }

        var reservation = new RoomReservation
        {
            Id = Guid.NewGuid(),
            RoomId = room.Id,
            UserId = user.Id,
            TimeSlotId = timeSlot.Id,
            BookingDate = request.BookingDate,
            ReservationStatus = ReservationStatus.SCHEDULING,
            AccessCode = await GenerateUniqueAccessCodeAsync(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        dbContext.RoomReservations.Add(reservation);
        await dbContext.SaveChangesAsync();

        await notificationService.CreateAsync(
            user.Id,
            "Room access code",
            $"Your access code for room {room.Name} on {request.BookingDate} from {timeSlot.StartTime} to {timeSlot.EndTime} is {reservation.AccessCode}.",
            NotificationType.ROOM_ACCESS_CODE);

        logger.LogInformation("Created room reservation {ReservationId}.", reservation.Id);
        return MapToResponse(reservation);
    }

    public async Task<RoomReservationResponseDto> UpdateAsync(Guid id, Guid currentUserId, bool isAdmin, UpdateRoomReservationRequestDto request)
    {
        var reservation = await dbContext.RoomReservations.FirstOrDefaultAsync(x => x.Id == id);
        if (reservation is null)
        {
            throw new KeyNotFoundException("Room reservation not found.");
        }

        EnsureOwnerOrAdmin(reservation, currentUserId, isAdmin);

        var room = await dbContext.Rooms.FirstOrDefaultAsync(x => x.Id == request.RoomId);
        if (room is null)
        {
            throw new KeyNotFoundException("Room not found.");
        }

        var timeSlot = await dbContext.TimeSlots.FirstOrDefaultAsync(x => x.Id == request.TimeSlotId);
        if (timeSlot is null)
        {
            throw new KeyNotFoundException("Time slot not found.");
        }

        ValidateBookingDate(request.BookingDate, timeSlot.StartTime);

        var hasDuplicate = await dbContext.RoomReservations.AnyAsync(x =>
            x.Id != id &&
            x.UserId == reservation.UserId &&
            x.TimeSlotId == timeSlot.Id &&
            x.BookingDate == request.BookingDate);
        if (hasDuplicate)
        {
            throw new InvalidOperationException("User already booked this time slot on this date.");
        }

        var currentBooked = await dbContext.RoomReservations.CountAsync(x =>
            x.Id != id &&
            x.RoomId == room.Id &&
            x.TimeSlotId == timeSlot.Id &&
            x.BookingDate == request.BookingDate &&
            (x.ReservationStatus == ReservationStatus.SCHEDULING || x.ReservationStatus == ReservationStatus.CONFIRMED));
        if (currentBooked >= room.Capacity)
        {
            throw new InvalidOperationException("Room is full.");
        }

        reservation.BookingDate = request.BookingDate;
        reservation.RoomId = room.Id;
        reservation.TimeSlotId = timeSlot.Id;
        reservation.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync();

        logger.LogInformation("Updated room reservation {ReservationId}.", reservation.Id);
        return MapToResponse(reservation);
    }

    public async Task DeleteAsync(Guid id)
    {
        var reservation = await dbContext.RoomReservations.FirstOrDefaultAsync(x => x.Id == id);
        if (reservation is null)
        {
            throw new KeyNotFoundException("Room reservation not found.");
        }

        dbContext.RoomReservations.Remove(reservation);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Deleted room reservation {ReservationId}.", reservation.Id);
    }

    public async Task<IReadOnlyList<RoomReservationResponseDto>> GetAllAsync()
    {
        var reservations = await dbContext.RoomReservations
            .OrderBy(x => x.BookingDate)
            .ThenBy(x => x.CreatedAt)
            .ToListAsync();

        return reservations.Select(MapToResponse).ToList();
    }

    public async Task<IReadOnlyList<RoomReservationResponseDto>> GetMineAsync(Guid userId)
    {
        var reservations = await dbContext.RoomReservations
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.BookingDate)
            .ThenByDescending(x => x.CreatedAt)
            .ToListAsync();

        return reservations.Select(MapToResponse).ToList();
    }

    public async Task<UpcomingReservationResponseDto?> GetUpcomingAsync(Guid userId)
    {
        var today = DateOnly.FromDateTime(DateTime.Now);

        var reservation = await dbContext.RoomReservations
            .Include(x => x.Room)
            .Include(x => x.TimeSlot)
            .Where(x => x.UserId == userId &&
                        x.ReservationStatus == ReservationStatus.SCHEDULING &&
                        x.BookingDate >= today)
            .OrderBy(x => x.BookingDate)
            .ThenBy(x => x.TimeSlot!.StartTime)
            .FirstOrDefaultAsync();

        if (reservation is null || reservation.TimeSlot is null)
        {
            return null;
        }

        return new UpcomingReservationResponseDto
        {
            Id = reservation.Id,
            RoomId = reservation.RoomId,
            RoomName = reservation.Room?.Name ?? string.Empty,
            TimeSlotId = reservation.TimeSlotId,
            StartTime = reservation.TimeSlot.StartTime,
            EndTime = reservation.TimeSlot.EndTime,
            BookingDate = reservation.BookingDate,
            AccessCode = reservation.AccessCode
        };
    }

    private async Task<string> GenerateUniqueAccessCodeAsync()
    {
        string code;
        do
        {
            code = GenerateAccessCode();
        } while (await dbContext.RoomReservations.AnyAsync(x => x.AccessCode == code));

        return code;
    }

    private static string GenerateAccessCode()
    {
        return new string(Enumerable.Range(0, 8)
            .Select(_ => CodeCharacters[Random.Shared.Next(CodeCharacters.Length)])
            .ToArray());
    }

    public async Task ConfirmAsync(Guid id, Guid currentUserId, bool isAdmin)
    {
        var reservation = await dbContext.RoomReservations
            .Include(x => x.TimeSlot)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (reservation is null)
        {
            throw new KeyNotFoundException("Room reservation not found.");
        }

        EnsureOwnerOrAdmin(reservation, currentUserId, isAdmin);

        if (reservation.TimeSlot is null)
        {
            throw new KeyNotFoundException("Time slot not found.");
        }

        var today = DateOnly.FromDateTime(DateTime.Now);
        var now = TimeOnly.FromDateTime(DateTime.Now);
        var startTime = reservation.TimeSlot.StartTime;
        var endConfirmTime = startTime.AddMinutes(10);

        if (reservation.ReservationStatus != ReservationStatus.SCHEDULING ||
            reservation.BookingDate != today ||
            now < startTime ||
            now > endConfirmTime)
        {
            throw new InvalidOperationException("Reservation cannot be confirmed outside the allowed time window.");
        }

        reservation.ReservationStatus = ReservationStatus.CONFIRMED;
        reservation.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Confirmed room reservation {ReservationId}.", reservation.Id);
    }

    public async Task CancelAsync(Guid id, Guid currentUserId, bool isAdmin)
    {
        var reservation = await dbContext.RoomReservations
            .Include(x => x.TimeSlot)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (reservation is null)
        {
            throw new KeyNotFoundException("Room reservation not found.");
        }

        EnsureOwnerOrAdmin(reservation, currentUserId, isAdmin);

        if (reservation.TimeSlot is null)
        {
            throw new KeyNotFoundException("Time slot not found.");
        }

        var today = DateOnly.FromDateTime(DateTime.Now);
        var now = TimeOnly.FromDateTime(DateTime.Now);
        var startTime = reservation.TimeSlot.StartTime;

        if (reservation.BookingDate < today ||
            (reservation.BookingDate == today && now >= startTime))
        {
            throw new InvalidOperationException("Reservation cannot be cancelled after the start time.");
        }

        reservation.ReservationStatus = ReservationStatus.CANCELLED;
        reservation.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Cancelled room reservation {ReservationId}.", reservation.Id);
    }

    private static void EnsureOwnerOrAdmin(RoomReservation reservation, Guid currentUserId, bool isAdmin)
    {
        if (!isAdmin && reservation.UserId != currentUserId)
        {
            throw new UnauthorizedAccessException("You are not allowed to modify this reservation.");
        }
    }

    private static void ValidateBookingDate(DateOnly bookingDate, TimeOnly startTime)
    {
        var today = DateOnly.FromDateTime(DateTime.Now);
        var now = TimeOnly.FromDateTime(DateTime.Now);

        if (bookingDate < today)
        {
            throw new InvalidOperationException("Booking date cannot be in the past.");
        }

        if (bookingDate == today && startTime <= now)
        {
            throw new InvalidOperationException("Booking time is no longer valid for today.");
        }
    }

    private static RoomReservationResponseDto MapToResponse(RoomReservation reservation)
    {
        return new RoomReservationResponseDto
        {
            Id = reservation.Id,
            RoomId = reservation.RoomId,
            UserId = reservation.UserId,
            TimeSlotId = reservation.TimeSlotId,
            BookingDate = reservation.BookingDate,
            ReservationStatus = reservation.ReservationStatus,
            AccessCode = reservation.AccessCode,
            CreatedAt = reservation.CreatedAt,
            UpdatedAt = reservation.UpdatedAt
        };
    }
}
