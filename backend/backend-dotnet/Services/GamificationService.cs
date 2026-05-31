using backend_dotnet.Context;
using backend_dotnet.DTOs.Gamification;
using backend_dotnet.Enums;
using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services;

public class GamificationService(
    LibraryManagementDbContext dbContext,
    INotificationService notificationService,
    ILogger<GamificationService> logger) : IGamificationService
{
    private const int PointsPerBorrow = 10;
    private const int PointsPerReview = 5;
    private const int PointsPerRoomReservation = 3;

    public async Task<UserGamificationProfileDto> GetMyProfileAsync(Guid userId)
    {
        var user = await dbContext.Users
            .FirstOrDefaultAsync(x => x.Id == userId && x.IsActive);
        if (user is null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        var points = await GetOrCreatePointsAsync(userId);
        var badges = await dbContext.UserBadges
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.EarnedAt)
            .ToListAsync();

        return new UserGamificationProfileDto
        {
            UserId = userId,
            UserName = user.FullName ?? string.Empty,
            AvatarUrl = user.AvatarUrl,
            Points = MapPointsToResponse(points),
            Badges = badges.Select(MapBadgeToResponse).ToList()
        };
    }

    public async Task<IReadOnlyList<LeaderboardEntryDto>> GetLeaderboardAsync(int top)
    {
        var topUsers = await dbContext.UserPoints
            .Include(x => x.User)
            .OrderByDescending(x => x.TotalPoints)
            .Take(Math.Clamp(top, 1, 100))
            .ToListAsync();

        var result = new List<LeaderboardEntryDto>();
        for (int i = 0; i < topUsers.Count; i++)
        {
            var up = topUsers[i];
            var badgeCount = await dbContext.UserBadges.CountAsync(x => x.UserId == up.UserId);
            result.Add(new LeaderboardEntryDto
            {
                Rank = i + 1,
                UserId = up.UserId,
                UserName = up.User?.FullName ?? string.Empty,
                AvatarUrl = up.User?.AvatarUrl,
                TotalPoints = up.TotalPoints,
                BooksRead = up.BooksRead,
                BadgeCount = badgeCount
            });
        }

        return result;
    }

    public async Task RecordBookBorrowAsync(Guid userId)
    {
        var points = await GetOrCreatePointsAsync(userId);
        points.BooksRead += 1;
        points.TotalPoints += PointsPerBorrow;
        UpdateStreak(points);
        await dbContext.SaveChangesAsync();

        await CheckAndAwardBorrowBadgesAsync(userId, points);
    }

    public async Task RecordReviewAsync(Guid userId)
    {
        var points = await GetOrCreatePointsAsync(userId);
        points.ReviewsWritten += 1;
        points.TotalPoints += PointsPerReview;
        UpdateStreak(points);
        await dbContext.SaveChangesAsync();

        await CheckAndAwardReviewBadgesAsync(userId, points);
    }

    public async Task RecordRoomReservationAsync(Guid userId)
    {
        var points = await GetOrCreatePointsAsync(userId);
        points.TotalPoints += PointsPerRoomReservation;
        UpdateStreak(points);
        await dbContext.SaveChangesAsync();

        await CheckAndAwardRoomBadgesAsync(userId);
    }

    private async Task<UserPoints> GetOrCreatePointsAsync(Guid userId)
    {
        var points = await dbContext.UserPoints.FirstOrDefaultAsync(x => x.UserId == userId);
        if (points is null)
        {
            points = new UserPoints
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                TotalPoints = 0,
                BooksRead = 0,
                ReviewsWritten = 0,
                CurrentStreak = 0,
                LongestStreak = 0,
                UpdatedAt = DateTime.UtcNow
            };
            dbContext.UserPoints.Add(points);
            await dbContext.SaveChangesAsync();
        }
        return points;
    }

    private static void UpdateStreak(UserPoints points)
    {
        var today = DateTime.UtcNow.Date;
        if (points.LastActivityDate.HasValue)
        {
            var lastDate = points.LastActivityDate.Value.Date;
            if (lastDate == today)
            {
                // Already active today, no change
                return;
            }
            else if (lastDate == today.AddDays(-1))
            {
                // Consecutive day
                points.CurrentStreak += 1;
            }
            else
            {
                // Streak broken
                points.CurrentStreak = 1;
            }
        }
        else
        {
            points.CurrentStreak = 1;
        }

        if (points.CurrentStreak > points.LongestStreak)
        {
            points.LongestStreak = points.CurrentStreak;
        }

        points.LastActivityDate = today;
        points.UpdatedAt = DateTime.UtcNow;
    }

    private async Task CheckAndAwardBorrowBadgesAsync(Guid userId, UserPoints points)
    {
        if (points.BooksRead == 1)
            await TryAwardBadgeAsync(userId, BadgeType.FIRST_BORROW, "First Borrow", "Borrowed your first book!", 10);
        if (points.BooksRead == 5)
            await TryAwardBadgeAsync(userId, BadgeType.BOOKWORM_5, "Bookworm", "Read 5 books!", 25);
        if (points.BooksRead == 10)
            await TryAwardBadgeAsync(userId, BadgeType.BOOKWORM_10, "Super Reader", "Read 10 books!", 50);
        if (points.BooksRead == 25)
            await TryAwardBadgeAsync(userId, BadgeType.BOOKWORM_25, "Library Legend", "Read 25 books!", 100);

        await CheckStreakBadgesAsync(userId, points);
    }

    private async Task CheckAndAwardReviewBadgesAsync(Guid userId, UserPoints points)
    {
        if (points.ReviewsWritten == 1)
            await TryAwardBadgeAsync(userId, BadgeType.REVIEWER, "First Review", "Wrote your first book review!", 15);

        await CheckStreakBadgesAsync(userId, points);
    }

    private async Task CheckAndAwardRoomBadgesAsync(Guid userId)
    {
        var reservationCount = await dbContext.RoomReservations.CountAsync(x => x.UserId == userId);
        if (reservationCount >= 5)
            await TryAwardBadgeAsync(userId, BadgeType.ROOM_REGULAR, "Room Regular", "Made 5 room reservations!", 20);
    }

    private async Task CheckStreakBadgesAsync(Guid userId, UserPoints points)
    {
        if (points.CurrentStreak >= 7)
            await TryAwardBadgeAsync(userId, BadgeType.STREAK_7, "Week Warrior", "7-day activity streak!", 30);
        if (points.CurrentStreak >= 30)
            await TryAwardBadgeAsync(userId, BadgeType.STREAK_30, "Monthly Master", "30-day activity streak!", 100);
    }

    private async Task TryAwardBadgeAsync(Guid userId, BadgeType badgeType, string name, string description, int bonusPoints)
    {
        var alreadyHas = await dbContext.UserBadges
            .AnyAsync(x => x.UserId == userId && x.BadgeType == badgeType);
        if (alreadyHas) return;

        var badge = new UserBadge
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            BadgeType = badgeType,
            BadgeName = name,
            Description = description,
            PointsAwarded = bonusPoints,
            EarnedAt = DateTime.UtcNow
        };

        dbContext.UserBadges.Add(badge);

        var points = await dbContext.UserPoints.FirstOrDefaultAsync(x => x.UserId == userId);
        if (points is not null)
        {
            points.TotalPoints += bonusPoints;
        }

        await dbContext.SaveChangesAsync();

        await notificationService.CreateAsync(
            userId,
            $"Badge Earned: {name}",
            $"Congratulations! You've earned the '{name}' badge: {description} (+{bonusPoints} points)",
            NotificationType.BADGE_EARNED);

        logger.LogInformation("User {UserId} earned badge {BadgeType}.", userId, badgeType);
    }

    private static UserPointsResponseDto MapPointsToResponse(UserPoints points)
    {
        return new UserPointsResponseDto
        {
            TotalPoints = points.TotalPoints,
            BooksRead = points.BooksRead,
            ReviewsWritten = points.ReviewsWritten,
            CurrentStreak = points.CurrentStreak,
            LongestStreak = points.LongestStreak,
            LastActivityDate = points.LastActivityDate
        };
    }

    private static UserBadgeResponseDto MapBadgeToResponse(UserBadge badge)
    {
        return new UserBadgeResponseDto
        {
            Id = badge.Id,
            BadgeType = badge.BadgeType,
            BadgeName = badge.BadgeName,
            Description = badge.Description,
            PointsAwarded = badge.PointsAwarded,
            EarnedAt = badge.EarnedAt
        };
    }
}
