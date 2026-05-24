using backend_dotnet.Context;
using backend_dotnet.DTOs.Books;
using backend_dotnet.DTOs.Common;
using backend_dotnet.Enums;
using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services;

public class BookService(
    LibraryManagementDbContext dbContext,
    IFileService fileService,
    ILogger<BookService> logger) : IBookService
{
    public async Task<BookResponseDto> GetByIdAsync(Guid id)
    {
        var book = await dbContext.Books.FirstOrDefaultAsync(x => x.Id == id);
        if (book is null)
        {
            throw new KeyNotFoundException("Book not found.");
        }

        return MapToResponse(book);
    }

    public async Task<PagedResultDto<BookResponseDto>> SearchAsync(GetBooksQueryDto query)
    {
        var books = dbContext.Books.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Isbn))
        {
            var isbn = query.Isbn.Trim();
            books = books.Where(x => x.Isbn == isbn);
        }

        if (!string.IsNullOrWhiteSpace(query.Title))
        {
            var title = query.Title.Trim().ToLower();
            books = books.Where(x => x.Title.ToLower().Contains(title));
        }

        if (!string.IsNullOrWhiteSpace(query.Author))
        {
            var author = query.Author.Trim().ToLower();
            books = books.Where(x => x.Author != null && x.Author.ToLower().Contains(author));
        }

        if (query.Category.HasValue)
        {
            books = books.Where(x => x.Category == query.Category.Value);
        }

        if (query.DocumentType.HasValue)
        {
            books = books.Where(x => x.DocumentType == query.DocumentType.Value);
        }

        var page = Math.Max(query.Page, 1);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);
        var totalItems = await books.CountAsync();
        var results = await books
            .OrderBy(x => x.Title)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResultDto<BookResponseDto>
        {
            Items = results.Select(MapToResponse).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }

    public async Task<BookResponseDto> CreateAsync(CreateBookRequestDto request)
    {
        var normalizedIsbn = request.Isbn.Trim();

        if (await dbContext.Books.AnyAsync(x => x.Isbn == normalizedIsbn))
        {
            logger.LogWarning("Create book failed because ISBN {Isbn} already exists.", normalizedIsbn);
            throw new InvalidOperationException("Book already exists.");
        }

        var book = new Book
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Author = request.Author?.Trim(),
            Isbn = normalizedIsbn,
            YearOfPublication = request.YearOfPublication,
            Category = request.Category,
            AvailableCopies = request.AvailableCopies,
            DocumentType = request.DocumentType,
            BookOnlineUrl = NormalizeOptionalUrl(request.BookOnlineUrl)
        };

        if (request.Image is not null)
        {
            book.ImageUrl = await fileService.SaveFileAsync(request.Image, "books");
        }

        if (request.DocumentFile is not null)
        {
            book.DocumentFileUrl = await fileService.SaveFileAsync(request.DocumentFile, "documents");
        }

        ApplyAvailability(book, request.AvailableCopies);

        dbContext.Books.Add(book);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Created book with ISBN {Isbn}.", normalizedIsbn);
        return MapToResponse(book);
    }

    public async Task<BookResponseDto> UpdateByIsbnAsync(string isbn, UpdateBookRequestDto request)
    {
        var normalizedIsbn = isbn.Trim();
        var book = await dbContext.Books.FirstOrDefaultAsync(x => x.Isbn == normalizedIsbn);
        if (book is null)
        {
            throw new KeyNotFoundException("Book not found.");
        }

        if (!string.IsNullOrWhiteSpace(request.Title))
        {
            book.Title = request.Title.Trim();
        }

        if (request.Author is not null)
        {
            book.Author = request.Author.Trim();
        }

        if (request.YearOfPublication.HasValue)
        {
            book.YearOfPublication = request.YearOfPublication.Value;
        }

        if (request.Category.HasValue)
        {
            book.Category = request.Category.Value;
        }

        if (request.AvailableCopies.HasValue)
        {
            book.AvailableCopies = request.AvailableCopies.Value;
            ApplyAvailability(book, request.AvailableCopies.Value);
        }

        if (request.Image is not null)
        {
            book.ImageUrl = await fileService.SaveFileAsync(request.Image, "books");
        }

        if (request.BookOnlineUrl is not null)
        {
            book.BookOnlineUrl = NormalizeOptionalUrl(request.BookOnlineUrl);
        }

        if (request.DocumentFile is not null)
        {
            book.DocumentFileUrl = await fileService.SaveFileAsync(request.DocumentFile, "documents");
        }

        if (request.DocumentType.HasValue)
        {
            book.DocumentType = request.DocumentType.Value;
        }

        await dbContext.SaveChangesAsync();

        logger.LogInformation("Updated book with ISBN {Isbn}.", normalizedIsbn);
        return MapToResponse(book);
    }

    public async Task DeleteByIsbnAsync(string isbn)
    {
        var normalizedIsbn = isbn.Trim();
        var book = await dbContext.Books.FirstOrDefaultAsync(x => x.Isbn == normalizedIsbn);
        if (book is null)
        {
            throw new KeyNotFoundException("Book not found.");
        }

        dbContext.Books.Remove(book);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Deleted book with ISBN {Isbn}.", normalizedIsbn);
    }

    private static void ApplyAvailability(Book book, int availableCopies)
    {
        book.Status = availableCopies > 0 ? BookStatus.AVAILABLE : BookStatus.NOT_AVAILABLE;
    }

    private static BookResponseDto MapToResponse(Book book)
    {
        return new BookResponseDto
        {
            Id = book.Id,
            Title = book.Title,
            Author = book.Author,
            Isbn = book.Isbn,
            YearOfPublication = book.YearOfPublication,
            Category = book.Category,
            AvailableCopies = book.AvailableCopies,
            ImageUrl = book.ImageUrl,
            BookOnlineUrl = book.BookOnlineUrl,
            DocumentFileUrl = book.DocumentFileUrl,
            Status = book.Status,
            DocumentType = book.DocumentType
        };
    }

    private static string? NormalizeOptionalUrl(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
