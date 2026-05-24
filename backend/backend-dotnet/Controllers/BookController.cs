using backend_dotnet.DTOs.Books;
using backend_dotnet.DTOs.Common;
using backend_dotnet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_dotnet.Controllers;

[ApiController]
[Route("api/books")]
public class BookController(IBookService bookService) : ControllerBase
{
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BookResponseDto>> GetBookById(Guid id)
    {
        try
        {
            var result = await bookService.GetByIdAsync(id);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<PagedResultDto<BookResponseDto>>> GetBooks([FromQuery] GetBooksQueryDto query)
    {
        var result = await bookService.SearchAsync(query);
        return Ok(result);
    }
    [Authorize(Roles = "ADMIN")]
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<BookResponseDto>> CreateBook([FromForm] CreateBookRequestDto request)
    {
        try
        {
            var result = await bookService.CreateAsync(request);
            return CreatedAtAction(nameof(GetBookById), new { id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPut("{isbn}")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<BookResponseDto>> UpdateBook(string isbn, [FromForm] UpdateBookRequestDto request)
    {
        try
        {
            var result = await bookService.UpdateByIsbnAsync(isbn, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [Authorize(Roles = "ADMIN")]
    [HttpDelete("{isbn}")]
    public async Task<IActionResult> DeleteBook(string isbn)
    {
        try
        {
            await bookService.DeleteByIsbnAsync(isbn);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
