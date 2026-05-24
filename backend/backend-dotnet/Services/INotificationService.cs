using backend_dotnet.DTOs.Notifications;
using backend_dotnet.Enums;

namespace backend_dotnet.Services;

public interface INotificationService
{
    Task<IReadOnlyList<NotificationResponseDto>> GetMyNotificationsAsync(Guid userId, bool unreadOnly);
    Task MarkAsReadAsync(Guid userId, Guid notificationId);
    Task CreateAsync(Guid userId, string title, string message, NotificationType type);
}
