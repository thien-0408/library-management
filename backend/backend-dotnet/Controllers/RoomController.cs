using backend_dotnet.DTOs.Rooms;
using backend_dotnet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_dotnet.Controllers;

[ApiController]
[Route("api/rooms")]
public class RoomController(IRoomService roomService) : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IReadOnlyList<RoomResponseDto>>> GetRooms()
    {
        var result = await roomService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("availability-room")]
    [Authorize]
    public async Task<ActionResult<IReadOnlyList<RoomAvailabilityResponseDto>>> GetAvailabilityRooms([FromQuery] Guid timeSlotId)
    {
        try
        {
            var result = await roomService.GetAvailabilityAsync(timeSlotId);
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

    [HttpGet("occupancy-rooms")]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<IReadOnlyList<RoomOccupancyResponseDto>>> GetRoomOccupancy([FromQuery] Guid timeSlotId)
    {
        try
        {
            var result = await roomService.GetOccupancyAsync(timeSlotId);
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

    [HttpPatch("{id:guid}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<RoomResponseDto>> UpdateRoom(Guid id, [FromBody] RoomRequestDto request)
    {
        try
        {
            var result = await roomService.UpdateAsync(id, request);
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
    public async Task<IActionResult> DeleteRoom(Guid id)
    {
        try
        {
            await roomService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<RoomResponseDto>> CreateRoom([FromBody] RoomRequestDto request)
    {
        try
        {
            var result = await roomService.CreateAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
