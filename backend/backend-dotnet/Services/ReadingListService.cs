using backend_dotnet.Context;
using backend_dotnet.DTOs.ReadingLists;
using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services;

public class ReadingListService(
    LibraryManagementDbContext dbContext,
    ILogger<ReadingListService> logger) : IReadingListService
{
    public async Task<IReadOnlyList<ReadingListResponseDto>> GetMyListsAsync(Guid userId)
    {
        var lists = await dbContext.ReadingLists
            .Include(x => x.Items)
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return lists.Select(MapToResponse).ToList();
    }

    public async Task<ReadingListDetailResponseDto> GetByIdAsync(Guid userId, Guid listId)
    {
        var list = await dbContext.ReadingLists
            .Include(x => x.Items)
                .ThenInclude(i => i.Book)
            .FirstOrDefaultAsync(x => x.Id == listId && x.UserId == userId);

        if (list is null)
        {
            throw new KeyNotFoundException("Reading list not found.");
        }

        return MapToDetailResponse(list);
    }

    public async Task<ReadingListResponseDto> CreateAsync(Guid userId, CreateReadingListRequestDto request)
    {
        var list = new ReadingList
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            ListType = request.ListType,
            CreatedAt = DateTime.UtcNow
        };

        dbContext.ReadingLists.Add(list);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("User {UserId} created reading list {ListId}.", userId, list.Id);
        return MapToResponse(list);
    }

    public async Task<ReadingListResponseDto> UpdateAsync(Guid userId, Guid listId, UpdateReadingListRequestDto request)
    {
        var list = await dbContext.ReadingLists
            .Include(x => x.Items)
            .FirstOrDefaultAsync(x => x.Id == listId && x.UserId == userId);

        if (list is null)
        {
            throw new KeyNotFoundException("Reading list not found.");
        }

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            list.Name = request.Name.Trim();
        }

        if (request.Description is not null)
        {
            list.Description = request.Description.Trim();
        }

        list.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();

        logger.LogInformation("User {UserId} updated reading list {ListId}.", userId, listId);
        return MapToResponse(list);
    }

    public async Task DeleteAsync(Guid userId, Guid listId)
    {
        var list = await dbContext.ReadingLists
            .Include(x => x.Items)
            .FirstOrDefaultAsync(x => x.Id == listId && x.UserId == userId);

        if (list is null)
        {
            throw new KeyNotFoundException("Reading list not found.");
        }

        dbContext.ReadingLists.Remove(list);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("User {UserId} deleted reading list {ListId}.", userId, listId);
    }

    public async Task<ReadingListItemResponseDto> AddBookAsync(Guid userId, Guid listId, AddBookToListRequestDto request)
    {
        var list = await dbContext.ReadingLists
            .FirstOrDefaultAsync(x => x.Id == listId && x.UserId == userId);

        if (list is null)
        {
            throw new KeyNotFoundException("Reading list not found.");
        }

        var normalizedIsbn = request.BookIsbn.Trim();
        var book = await dbContext.Books.FirstOrDefaultAsync(x => x.Isbn == normalizedIsbn);
        if (book is null)
        {
            throw new KeyNotFoundException("Book not found.");
        }

        var alreadyExists = await dbContext.ReadingListItems
            .AnyAsync(x => x.ReadingListId == listId && x.BookId == book.Id);
        if (alreadyExists)
        {
            throw new InvalidOperationException("Book is already in this list.");
        }

        var item = new ReadingListItem
        {
            Id = Guid.NewGuid(),
            ReadingListId = listId,
            BookId = book.Id,
            Notes = request.Notes?.Trim(),
            AddedAt = DateTime.UtcNow
        };

        dbContext.ReadingListItems.Add(item);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("User {UserId} added book {BookId} to reading list {ListId}.", userId, book.Id, listId);

        return new ReadingListItemResponseDto
        {
            Id = item.Id,
            BookId = book.Id,
            BookTitle = book.Title,
            BookIsbn = book.Isbn,
            BookImageUrl = book.ImageUrl,
            BookAuthor = book.Author,
            Notes = item.Notes,
            AddedAt = item.AddedAt
        };
    }

    public async Task RemoveBookAsync(Guid userId, Guid listId, Guid itemId)
    {
        var list = await dbContext.ReadingLists
            .FirstOrDefaultAsync(x => x.Id == listId && x.UserId == userId);

        if (list is null)
        {
            throw new KeyNotFoundException("Reading list not found.");
        }

        var item = await dbContext.ReadingListItems
            .FirstOrDefaultAsync(x => x.Id == itemId && x.ReadingListId == listId);

        if (item is null)
        {
            throw new KeyNotFoundException("Item not found in this list.");
        }

        dbContext.ReadingListItems.Remove(item);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("User {UserId} removed item {ItemId} from reading list {ListId}.", userId, itemId, listId);
    }

    private static ReadingListResponseDto MapToResponse(ReadingList list)
    {
        return new ReadingListResponseDto
        {
            Id = list.Id,
            UserId = list.UserId,
            Name = list.Name,
            Description = list.Description,
            ListType = list.ListType,
            ItemCount = list.Items?.Count ?? 0,
            CreatedAt = list.CreatedAt,
            UpdatedAt = list.UpdatedAt
        };
    }

    private static ReadingListDetailResponseDto MapToDetailResponse(ReadingList list)
    {
        return new ReadingListDetailResponseDto
        {
            Id = list.Id,
            UserId = list.UserId,
            Name = list.Name,
            Description = list.Description,
            ListType = list.ListType,
            Items = list.Items?.Select(i => new ReadingListItemResponseDto
            {
                Id = i.Id,
                BookId = i.BookId,
                BookTitle = i.Book?.Title ?? string.Empty,
                BookIsbn = i.Book?.Isbn,
                BookImageUrl = i.Book?.ImageUrl,
                BookAuthor = i.Book?.Author,
                Notes = i.Notes,
                AddedAt = i.AddedAt
            }).ToList() ?? [],
            CreatedAt = list.CreatedAt,
            UpdatedAt = list.UpdatedAt
        };
    }
}
