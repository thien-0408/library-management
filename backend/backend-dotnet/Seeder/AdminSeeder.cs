using backend_dotnet.Context;
using backend_dotnet.Enums;
using backend_dotnet.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace backend_dotnet.Seeder;

public class AdminSeeder(
    LibraryManagementDbContext dbContext,
    ILogger<AdminSeeder> logger)
{
    public async Task SeedAsync()
    {
        try
        {
            const string adminEmail = "adminlib@gmail.com";
            const string adminPassword = "Admin@123!";

            if (!await dbContext.Users.AnyAsync(x => x.Email == adminEmail))
            {
                var admin = new User
                {
                    Id = Guid.NewGuid(),
                    Email = adminEmail,
                    FullName = "Administrator",
                    Role = Role.ADMIN,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                var passwordHasher = new PasswordHasher<User>();
                admin.PasswordHash = passwordHasher.HashPassword(admin, adminPassword);

                dbContext.Users.Add(admin);
                await dbContext.SaveChangesAsync();

                logger.LogInformation("Default admin account created with email {Email}.", adminEmail);
            }
            else
            {
                logger.LogInformation("Default admin account already exists.");
            }

            var existingRoomNames = await dbContext.Rooms
                .Select(x => x.Name)
                .ToListAsync();

            var defaultRooms = new List<Room>
            {
                new() { Name = "Quiet Room 1", Description = "Silent study space", Capacity = 4 },
                new() { Name = "Quiet Room 2", Description = "Silent study space", Capacity = 4 },
                new() { Name = "Discussion Room 1", Description = "Small group discussion room", Capacity = 6 },
                new() { Name = "Discussion Room 2", Description = "Medium group discussion room", Capacity = 8 },
                new() { Name = "Research Room", Description = "Focused research and project work", Capacity = 10 },
            };

            var roomsToSeed = defaultRooms
                .Where(room => !existingRoomNames.Contains(room.Name))
                .Select(room =>
                {
                    room.Id = Guid.NewGuid();
                    room.CreatedAt = DateTime.UtcNow;
                    room.UpdatedAt = DateTime.UtcNow;
                    return room;
                })
                .ToList();

            if (roomsToSeed.Count > 0)
            {
                dbContext.Rooms.AddRange(roomsToSeed);
                await dbContext.SaveChangesAsync();
                logger.LogInformation("Seeded {RoomCount} default rooms.", roomsToSeed.Count);
            }
            else
            {
                logger.LogInformation("Default rooms already exist.");
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Skipping admin and room seeding because the database is not ready.");
        }
    }
}
