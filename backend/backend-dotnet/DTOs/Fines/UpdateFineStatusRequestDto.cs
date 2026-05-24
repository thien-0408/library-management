using backend_dotnet.Enums;

namespace backend_dotnet.DTOs.Fines;

public class UpdateFineStatusRequestDto
{
    public FineStatus Status { get; set; }
}
