using backend_dotnet.DTOs.BookReviews;
using backend_dotnet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_dotnet.Controllers;

[ApiController]
[Route("api/books/reviews")]
[Authorize]
public class BookReviewsController(IBookReviewService bookReviewService) : ControllerBase
{
    [HttpGet("book/{bookId:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<BookReviewResponseDto>>> GetByBookId(Guid bookId)
    {
        var result = await bookReviewService.GetByBookIdAsync(bookId);
        return Ok(result);
    }

    [HttpGet("book/{bookId:guid}/summary")]
    [AllowAnonymous]
    public async Task<ActionResult<BookRatingSummaryDto>> GetRatingSummary(Guid bookId)
    {
        var result = await bookReviewService.GetRatingSummaryAsync(bookId);
        return Ok(result);
    }

    [HttpGet("me")]
    public async Task<ActionResult<IReadOnlyList<BookReviewResponseDto>>> GetMyReviews()
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        var result = await bookReviewService.GetMyReviewsAsync(userId);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<BookReviewResponseDto>> Create([FromBody] CreateBookReviewRequestDto request)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            var result = await bookReviewService.CreateAsync(userId, request);
            return CreatedAtAction(nameof(GetByBookId), new { bookId = result.BookId }, result);
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
    public async Task<ActionResult<BookReviewResponseDto>> Update(Guid id, [FromBody] UpdateBookReviewRequestDto request)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        try
        {
            var result = await bookReviewService.UpdateAsync(userId, id, request);
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
            await bookReviewService.DeleteAsync(userId, id);
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
