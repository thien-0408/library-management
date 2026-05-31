namespace backend_dotnet.DTOs.ReadingLists;

public class ReadingListItemResponseDto
{
    public Guid Id { get; set; }
    public Guid BookId { get; set; }
    public string BookTitle { get; set; } = string.Empty;
    public string? BookIsbn { get; set; }
    public string? BookImageUrl { get; set; }
    public string? BookAuthor { get; set; }
    public string? Notes { get; set; }
    public DateTime AddedAt { get; set; }
}
