namespace backend_dotnet.Services;

public interface IFileService
{
    Task<string> SaveFileAsync(IFormFile file, string folder);
}
