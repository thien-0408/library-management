using backend_dotnet.DTOs.BorrowBooks;
using backend_dotnet.DTOs.Common;
using backend_dotnet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_dotnet.Controllers;

[ApiController]
[Route("api/books/requests")]
[Authorize]
public class BorrowBookRequestsController(IBorrowBookRequestService borrowBookRequestService) : ControllerBase
{
    [HttpGet("me")]
    public async Task<ActionResult<IReadOnlyList<BorrowBookResponseDto>>> GetMyRequests()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        var result = await borrowBookRequestService.GetMyRequestsAsync(userId);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<BorrowBookResponseDto>> CreateRequest([FromBody] CreateBorrowBookRequestDto request)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            var result = await borrowBookRequestService.CreateAsync(userId, request);
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

    [HttpPut("{id:guid}/return")]
    public async Task<ActionResult<BorrowBookResponseDto>> ReturnRequest(Guid id)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            var result = await borrowBookRequestService.ReturnAsync(id, userId);
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

    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<PagedResultDto<BorrowBookResponseDto>>> GetAllRequests([FromQuery] GetBorrowBookRequestsQueryDto query)
    {
        var result = await borrowBookRequestService.GetAllAsync(query);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<BorrowBookResponseDto>> UpdateRequestStatus(Guid id, [FromBody] UpdateBorrowBookRequestDto request)
    {
        try
        {
            var result = await borrowBookRequestService.UpdateStatusAsync(id, request);
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
}
