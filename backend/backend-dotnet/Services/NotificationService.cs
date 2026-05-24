using backend_dotnet.Context;
using backend_dotnet.DTOs.Notifications;
using backend_dotnet.Enums;
using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services;

public class NotificationService(LibraryManagementDbContext dbContext) : INotificationService
{
    public async Task<IReadOnlyList<NotificationResponseDto>> GetMyNotificationsAsync(Guid userId, bool unreadOnly)
    {
        var query = dbContext.Notifications.Where(x => x.UserId == userId);
        if (unreadOnly)
        {
            query = query.Where(x => !x.IsRead);
        }

        var notifications = await query.OrderByDescending(x => x.CreatedAt).ToListAsync();
        return notifications.Select(MapToResponse).ToList();
    }

    public async Task MarkAsReadAsync(Guid userId, Guid notificationId)
    {
        var notification = await dbContext.Notifications.FirstOrDefaultAsync(x => x.Id == notificationId && x.UserId == userId);
        if (notification is null)
        {
            throw new KeyNotFoundException("Notification not found.");
        }

        notification.IsRead = true;
        await dbContext.SaveChangesAsync();
    }

    public async Task CreateAsync(Guid userId, string title, string message, NotificationType type)
    {
        dbContext.Notifications.Add(new Notification
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = title,
            Message = message,
            Type = type,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        });

        await dbContext.SaveChangesAsync();
    }

    private static NotificationResponseDto MapToResponse(Notification notification)
    {
        return new NotificationResponseDto
        {
            Id = notification.Id,
            Title = notification.Title,
            Message = notification.Message,
            Type = notification.Type,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt
        };
    }
}
