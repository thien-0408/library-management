using System.ComponentModel.DataAnnotations;
using backend_dotnet.Enums;

namespace backend_dotnet.DTOs.BorrowBooks;

public class CreateBorrowBookRequestDto
{
    [Required]
    public string BookIsbn { get; set; } = string.Empty;

    [Required]
    public BorrowMode BorrowMode { get; set; }
}
