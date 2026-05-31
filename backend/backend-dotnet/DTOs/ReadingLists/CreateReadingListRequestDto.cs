using backend_dotnet.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.DTOs.ReadingLists;

public class CreateReadingListRequestDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public ReadingListType ListType { get; set; } = ReadingListType.CUSTOM;
}
