using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models;

[Table("reading_list_items")]
public class ReadingListItem
{
    [Key]
    public Guid Id { get; set; }

    public Guid ReadingListId { get; set; }
    [ForeignKey(nameof(ReadingListId))]
    public ReadingList? ReadingList { get; set; }

    public Guid BookId { get; set; }
    [ForeignKey(nameof(BookId))]
    public Book? Book { get; set; }

    public string? Notes { get; set; }

    public DateTime AddedAt { get; set; }
}
