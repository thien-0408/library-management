using backend_dotnet.Context;
using backend_dotnet.DTOs.Rooms;
using backend_dotnet.Enums;
using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services;

public class RoomService(
    LibraryManagementDbContext dbContext,
    ILogger<RoomService> logger) : IRoomService
{
    public async Task<IReadOnlyList<RoomResponseDto>> GetAllAsync()
    {
        var rooms = await dbContext.Rooms.ToListAsync();
        return rooms.Select(MapToResponse).ToList();
    }

    public async Task<IReadOnlyList<RoomAvailabilityResponseDto>> GetAvailabilityAsync(Guid timeSlotId)
    {
        var timeSlot = await dbContext.TimeSlots.FirstOrDefaultAsync(x => x.Id == timeSlotId);
        if (timeSlot is null)
        {
            throw new KeyNotFoundException("Time slot not found.");
        }

        var rooms = await dbContext.Rooms.ToListAsync();
        var responses = new List<RoomAvailabilityResponseDto>();

        foreach (var room in rooms)
        {
            var bookedCount = await dbContext.RoomReservations.CountAsync(x =>
                x.RoomId == room.Id &&
                x.TimeSlotId == timeSlotId &&
                x.ReservationStatus == ReservationStatus.SCHEDULING);

            responses.Add(new RoomAvailabilityResponseDto
            {
                Id = room.Id,
                Name = room.Name,
                Description = room.Description,
                Capacity = room.Capacity,
                SeatsLeft = Math.Max(room.Capacity - bookedCount, 0),
                IsFull = bookedCount >= room.Capacity
            });
        }

        return responses;
    }

    public async Task<IReadOnlyList<RoomOccupancyResponseDto>> GetOccupancyAsync(Guid timeSlotId)
    {
        var timeSlot = await dbContext.TimeSlots.FirstOrDefaultAsync(x => x.Id == timeSlotId);
        if (timeSlot is null)
        {
            throw new KeyNotFoundException("Time slot not found.");
        }

        var rooms = await dbContext.Rooms.ToListAsync();
        var responses = new List<RoomOccupancyResponseDto>();

        foreach (var room in rooms)
        {
            var bookedCount = await dbContext.RoomReservations.CountAsync(x =>
                x.RoomId == room.Id &&
                x.TimeSlotId == timeSlotId &&
                (x.ReservationStatus == ReservationStatus.SCHEDULING || x.ReservationStatus == ReservationStatus.CONFIRMED));

            responses.Add(new RoomOccupancyResponseDto
            {
                RoomId = room.Id,
                RoomName = room.Name,
                Capacity = room.Capacity,
                BookedCount = bookedCount
            });
        }

        return responses;
    }

    public async Task<RoomResponseDto> CreateAsync(RoomRequestDto request)
    {
        var normalizedName = request.Name.Trim();
        if (await dbContext.Rooms.AnyAsync(x => x.Name == normalizedName))
        {
            throw new InvalidOperationException("Room name already exists.");
        }

        var room = new Room
        {
            Id = Guid.NewGuid(),
            Name = normalizedName,
            Description = request.Description?.Trim(),
            Capacity = request.Capacity,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        dbContext.Rooms.Add(room);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Created room {RoomId}.", room.Id);
        return MapToResponse(room);
    }

    public async Task<RoomResponseDto> UpdateAsync(Guid id, RoomRequestDto request)
    {
        var room = await dbContext.Rooms.FirstOrDefaultAsync(x => x.Id == id);
        if (room is null)
        {
            throw new KeyNotFoundException("Room not found.");
        }

        var normalizedName = request.Name.Trim();
        if (await dbContext.Rooms.AnyAsync(x => x.Name == normalizedName && x.Id != id))
        {
            throw new InvalidOperationException("Room name already exists.");
        }

        room.Name = normalizedName;
        room.Description = request.Description?.Trim();
        room.Capacity = request.Capacity;
        room.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync();

        logger.LogInformation("Updated room {RoomId}.", room.Id);
        return MapToResponse(room);
    }

    public async Task DeleteAsync(Guid id)
    {
        var room = await dbContext.Rooms.FirstOrDefaultAsync(x => x.Id == id);
        if (room is null)
        {
            throw new KeyNotFoundException("Room not found.");
        }

        dbContext.Rooms.Remove(room);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Deleted room {RoomId}.", room.Id);
    }

    private static RoomResponseDto MapToResponse(Room room)
    {
        return new RoomResponseDto
        {
            Id = room.Id,
            Name = room.Name,
            Description = room.Description,
            Capacity = room.Capacity,
            CreatedAt = room.CreatedAt,
            UpdatedAt = room.UpdatedAt
        };
    }
}
