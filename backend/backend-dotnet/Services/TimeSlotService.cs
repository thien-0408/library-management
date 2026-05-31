using backend_dotnet.Context;
using backend_dotnet.DTOs.TimeSlots;
using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services;

public class TimeSlotService(
    LibraryManagementDbContext dbContext,
    ILogger<TimeSlotService> logger) : ITimeSlotService
{
    public async Task<IReadOnlyList<TimeSlotResponseDto>> GetAllAsync()
    {
        var timeSlots = await dbContext.TimeSlots
            .OrderBy(x => x.StartTime)
            .ToListAsync();

        return timeSlots.Select(MapToResponse).ToList();
    }

    public async Task<TimeSlotResponseDto> CreateAsync(TimeSlotRequestDto request)
    {
        if (await dbContext.TimeSlots.AnyAsync(x => x.StartTime == request.StartTime))
        {
            throw new InvalidOperationException("Start time already exists.");
        }

        if (await dbContext.TimeSlots.AnyAsync(x => x.EndTime == request.EndTime))
        {
            throw new InvalidOperationException("End time already exists.");
        }

        var timeSlot = new TimeSlot
        {
            Id = Guid.NewGuid(),
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        dbContext.TimeSlots.Add(timeSlot);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Created time slot {TimeSlotId}.", timeSlot.Id);
        return MapToResponse(timeSlot);
    }

    public async Task<TimeSlotResponseDto> UpdateAsync(Guid id, TimeSlotRequestDto request)
    {
        var timeSlot = await dbContext.TimeSlots.FirstOrDefaultAsync(x => x.Id == id);
        if (timeSlot is null)
        {
            throw new KeyNotFoundException("Time slot not found.");
        }

        if (await dbContext.TimeSlots.AnyAsync(x => x.StartTime == request.StartTime && x.Id != id))
        {
            throw new InvalidOperationException("Start time already exists.");
        }

        if (await dbContext.TimeSlots.AnyAsync(x => x.EndTime == request.EndTime && x.Id != id))
        {
            throw new InvalidOperationException("End time already exists.");
        }

        timeSlot.StartTime = request.StartTime;
        timeSlot.EndTime = request.EndTime;
        timeSlot.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync();

        logger.LogInformation("Updated time slot {TimeSlotId}.", timeSlot.Id);
        return MapToResponse(timeSlot);
    }

    public async Task DeleteAsync(Guid id)
    {
        var timeSlot = await dbContext.TimeSlots.FirstOrDefaultAsync(x => x.Id == id);
        if (timeSlot is null)
        {
            throw new KeyNotFoundException("Time slot not found.");
        }

        dbContext.TimeSlots.Remove(timeSlot);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Deleted time slot {TimeSlotId}.", timeSlot.Id);
    }

    public async Task<int> DeleteExpiredUnusedAsync(CancellationToken cancellationToken = default)
    {
        await Task.CompletedTask;
        return 0;
    }

    private static TimeSlotResponseDto MapToResponse(TimeSlot timeSlot)
    {
        return new TimeSlotResponseDto
        {
            Id = timeSlot.Id,
            StartTime = timeSlot.StartTime,
            EndTime = timeSlot.EndTime,
            CreatedAt = timeSlot.CreatedAt,
            UpdatedAt = timeSlot.UpdatedAt
        };
    }
}
