using backend_dotnet.DTOs.Fines;
using backend_dotnet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_dotnet.Controllers;

[ApiController]
[Route("api/fines")]
[Authorize]
public class FinesController(IFineService fineService) : ControllerBase
{
    [HttpGet("me")]
    public async Task<ActionResult<IReadOnlyList<OverdueFineResponseDto>>> GetMyFines()
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        var result = await fineService.GetMyFinesAsync(userId);
        return Ok(result);
    }

    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<IReadOnlyList<OverdueFineResponseDto>>> GetAllFines()
    {
        var result = await fineService.GetAllAsync();
        return Ok(result);
    }

    [HttpPost("generate-overdue")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> GenerateOverdueFines()
    {
        await fineService.GenerateOverdueFinesAsync();
        return NoContent();
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<OverdueFineResponseDto>> UpdateFineStatus(Guid id, [FromBody] UpdateFineStatusRequestDto request)
    {
        try
        {
            var result = await fineService.UpdateStatusAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    private bool TryGetCurrentUserId(out Guid userId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userIdClaim, out userId);
    }
}
