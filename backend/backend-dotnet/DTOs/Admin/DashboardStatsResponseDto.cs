namespace backend_dotnet.DTOs.Admin;

public class DashboardStatsResponseDto
{
    public int ActiveUsers { get; set; }
    public int TotalBooks { get; set; }
    public int BorrowedBooks { get; set; }
    public int OverdueBooks { get; set; }
    public int PendingBorrowRequests { get; set; }
    public int WaitingBookHolds { get; set; }
    public int UnpaidFines { get; set; }
    public decimal UnpaidFineAmount { get; set; }
    public int RoomReservationsToday { get; set; }
    public int TotalBookReviews { get; set; }
}
