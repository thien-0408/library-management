using backend_dotnet.Enums;

namespace backend_dotnet.DTOs.ReadingLists;

public class ReadingListDetailResponseDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ReadingListType ListType { get; set; }
    public IReadOnlyList<ReadingListItemResponseDto> Items { get; set; } = [];
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
