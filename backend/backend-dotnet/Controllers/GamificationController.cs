using backend_dotnet.DTOs.Gamification;
using backend_dotnet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_dotnet.Controllers;

[ApiController]
[Route("api/gamification")]
[Authorize]
public class GamificationController(IGamificationService gamificationService) : ControllerBase
{
    [HttpGet("me")]
    public async Task<ActionResult<UserGamificationProfileDto>> GetMyProfile()
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            var result = await gamificationService.GetMyProfileAsync(userId);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("leaderboard")]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<LeaderboardEntryDto>>> GetLeaderboard([FromQuery] int top = 10)
    {
        var result = await gamificationService.GetLeaderboardAsync(top);
        return Ok(result);
    }

    private bool TryGetCurrentUserId(out Guid userId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userIdClaim, out userId);
    }
}
