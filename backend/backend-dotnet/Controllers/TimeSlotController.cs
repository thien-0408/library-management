using backend_dotnet.DTOs.TimeSlots;
using backend_dotnet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_dotnet.Controllers;

[ApiController]
[Route("api/time-slots")]
public class TimeSlotController(ITimeSlotService timeSlotService) : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IReadOnlyList<TimeSlotResponseDto>>> GetTimeSlots()
    {
        var result = await timeSlotService.GetAllAsync();
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<TimeSlotResponseDto>> CreateTimeSlot([FromBody] TimeSlotRequestDto request)
    {
        try
        {
            var result = await timeSlotService.CreateAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPatch("{id:guid}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<TimeSlotResponseDto>> UpdateTimeSlot(Guid id, [FromBody] TimeSlotRequestDto request)
    {
        try
        {
            var result = await timeSlotService.UpdateAsync(id, request);
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
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> DeleteTimeSlot(Guid id)
    {
        try
        {
            await timeSlotService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
