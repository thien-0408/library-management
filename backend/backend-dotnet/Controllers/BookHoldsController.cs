using backend_dotnet.DTOs.BookHolds;
using backend_dotnet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_dotnet.Controllers;

[ApiController]
[Route("api/books/holds")]
[Authorize]
public class BookHoldsController(IBookHoldService bookHoldService) : ControllerBase
{
    [HttpGet("me")]
    public async Task<ActionResult<IReadOnlyList<BookHoldResponseDto>>> GetMyHolds()
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        var result = await bookHoldService.GetMyHoldsAsync(userId);
        return Ok(result);
    }

    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<IReadOnlyList<BookHoldResponseDto>>> GetAllHolds()
    {
        var result = await bookHoldService.GetAllAsync();
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<BookHoldResponseDto>> CreateHold([FromBody] CreateBookHoldRequestDto request)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            var result = await bookHoldService.CreateAsync(userId, request);
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

    [HttpPatch("{id:guid}/cancel")]
    public async Task<IActionResult> CancelHold(Guid id)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            await bookHoldService.CancelAsync(userId, id, User.IsInRole("ADMIN"));
            return NoContent();
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

    private bool TryGetCurrentUserId(out Guid userId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userIdClaim, out userId);
    }
}
