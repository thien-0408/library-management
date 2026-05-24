using backend_dotnet.DTOs.RoomReservations;
using backend_dotnet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_dotnet.Controllers;

[ApiController]
[Route("api/room-reservations")]
[Authorize]
public class RoomReservationController(IRoomReservationService roomReservationService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<RoomReservationResponseDto>> CreateRoomReservation([FromBody] CreateRoomReservationRequestDto request)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            var result = await roomReservationService.CreateAsync(userId, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("upcoming")]
    public async Task<ActionResult<UpcomingReservationResponseDto?>> GetUpcomingReservation()
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        var result = await roomReservationService.GetUpcomingAsync(userId);
        return Ok(result);
    }

    [HttpGet("me")]
    public async Task<ActionResult<IReadOnlyList<RoomReservationResponseDto>>> GetMyReservations()
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        var result = await roomReservationService.GetMineAsync(userId);
        return Ok(result);
    }

    [HttpPatch("{id:guid}/confirm")]
    public async Task<IActionResult> ConfirmReservation(Guid id)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            await roomReservationService.ConfirmAsync(id, userId, User.IsInRole("ADMIN"));
            return NoContent();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPatch("{id:guid}/cancel")]
    public async Task<IActionResult> CancelReservation(Guid id)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            await roomReservationService.CancelAsync(id, userId, User.IsInRole("ADMIN"));
            return NoContent();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<RoomReservationResponseDto>> UpdateRoomReservation(Guid id, [FromBody] UpdateRoomReservationRequestDto request)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            var result = await roomReservationService.UpdateAsync(id, userId, User.IsInRole("ADMIN"), request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<IReadOnlyList<RoomReservationResponseDto>>> GetAllRoomReservations()
    {
        var result = await roomReservationService.GetAllAsync();
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> DeleteRoomReservation(Guid id)
    {
        try
        {
            await roomReservationService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    private bool TryGetCurrentUserId(out Guid userId)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userIdValue, out userId);
    }
}
