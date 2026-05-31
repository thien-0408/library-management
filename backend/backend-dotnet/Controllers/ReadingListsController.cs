using backend_dotnet.DTOs.ReadingLists;
using backend_dotnet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_dotnet.Controllers;

[ApiController]
[Route("api/reading-lists")]
[Authorize]
public class ReadingListsController(IReadingListService readingListService) : ControllerBase
{
    [HttpGet("me")]
    public async Task<ActionResult<IReadOnlyList<ReadingListResponseDto>>> GetMyLists()
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        var result = await readingListService.GetMyListsAsync(userId);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ReadingListDetailResponseDto>> GetById(Guid id)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            var result = await readingListService.GetByIdAsync(userId, id);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<ReadingListResponseDto>> Create([FromBody] CreateReadingListRequestDto request)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        var result = await readingListService.CreateAsync(userId, request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ReadingListResponseDto>> Update(Guid id, [FromBody] UpdateReadingListRequestDto request)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            var result = await readingListService.UpdateAsync(userId, id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            await readingListService.DeleteAsync(userId, id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("{id:guid}/items")]
    public async Task<ActionResult<ReadingListItemResponseDto>> AddBook(Guid id, [FromBody] AddBookToListRequestDto request)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            var result = await readingListService.AddBookAsync(userId, id, request);
            return CreatedAtAction(nameof(GetById), new { id }, result);
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

    [HttpDelete("{id:guid}/items/{itemId:guid}")]
    public async Task<IActionResult> RemoveBook(Guid id, Guid itemId)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            await readingListService.RemoveBookAsync(userId, id, itemId);
            return NoContent();
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
