using backend_dotnet.Enums;

namespace backend_dotnet.DTOs.BorrowBooks;

public class GetBorrowBookRequestsQueryDto
{
    public BookPendingStatus? Status { get; set; }

    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 20;
}
