namespace backend_dotnet.Services;

public class ExpiredTimeSlotCleanupService(
    IServiceScopeFactory scopeFactory,
    ILogger<ExpiredTimeSlotCleanupService> logger) : BackgroundService
{
    private static readonly TimeSpan CleanupInterval = TimeSpan.FromMinutes(1);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await CleanupAsync(stoppingToken);

        using var timer = new PeriodicTimer(CleanupInterval);
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            await CleanupAsync(stoppingToken);
        }
    }

    private async Task CleanupAsync(CancellationToken cancellationToken)
    {
        try
        {
            using var scope = scopeFactory.CreateScope();
            var timeSlotService = scope.ServiceProvider.GetRequiredService<ITimeSlotService>();
            await timeSlotService.DeleteExpiredUnusedAsync(cancellationToken);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to clean up expired time slots.");
        }
    }
}
