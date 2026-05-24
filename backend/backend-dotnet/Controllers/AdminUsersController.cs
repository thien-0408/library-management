using backend_dotnet.DTOs.AdminUsers;
using backend_dotnet.DTOs.Common;
using backend_dotnet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_dotnet.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "ADMIN")]
public class AdminUsersController(IAdminUserService adminUserService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResultDto<AdminUserResponseDto>>> GetUsers([FromQuery] bool includeInactive = false, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await adminUserService.GetAllAsync(includeInactive, page, pageSize);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AdminUserResponseDto>> GetUser(Guid id)
    {
        try
        {
            var result = await adminUserService.GetByIdAsync(id);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<AdminUserResponseDto>> CreateUser([FromBody] AdminCreateUserRequestDto request)
    {
        try
        {
            var result = await adminUserService.CreateAsync(request);
            return CreatedAtAction(nameof(GetUser), new { id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPatch("{id:guid}")]
    public async Task<ActionResult<AdminUserResponseDto>> UpdateUser(Guid id, [FromBody] AdminUpdateUserRequestDto request)
    {
        try
        {
            if (!TryGetCurrentUserId(out var currentAdminId))
            {
                return Unauthorized(new { message = "Invalid user token." });
            }

            var result = await adminUserService.UpdateAsync(id, currentAdminId, request);
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

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        try
        {
            if (!TryGetCurrentUserId(out var currentAdminId))
            {
                return Unauthorized(new { message = "Invalid user token." });
            }

            await adminUserService.SoftDeleteAsync(id, currentAdminId);
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
