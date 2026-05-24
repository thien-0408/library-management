using backend_dotnet.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.DTOs.BorrowBooks;

public class UpdateBorrowBookRequestDto
{
    [Required]
    public BookPendingStatus Status { get; set; }
}
