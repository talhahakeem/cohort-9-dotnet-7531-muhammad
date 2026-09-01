using Microsoft.EntityFrameworkCore;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Enums;
using TaskManagement.Infrastructure.Data;
using TaskManagement.Infrastructure.Services;

namespace TaskManagement.Tests.Services;

public class DashboardServiceTests
{
    private static ApplicationDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task GetDashboardStatsAsync_ShouldReturnCorrectCounts_ForUser()
    {
        // Arrange
        await using var context = CreateContext();

        var userId = "user-1";

        context.Tasks.AddRange(
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Pending Task",
                UserId = userId,
                Status = TaskItemStatus.Pending
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "In Progress Task",
                UserId = userId,
                Status = TaskItemStatus.InProgress
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Completed Task",
                UserId = userId,
                Status = TaskItemStatus.Completed
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Another Pending Task",
                UserId = userId,
                Status = TaskItemStatus.Pending
            }
        );

        await context.SaveChangesAsync();

        var service = new DashboardService(context);

        // Act
        var result = await service.GetDashboardStatsAsync(userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.PendingTasks);
        Assert.Equal(1, result.InProgressTasks);
        Assert.Equal(1, result.CompletedTasks);
    }

    [Fact]
    public async Task GetDashboardStatsAsync_ShouldIgnoreTasksBelongingToOtherUsers()
    {
        // Arrange
        await using var context = CreateContext();

        var userId = "user-1";
        var otherUserId = "user-2";

        context.Tasks.AddRange(
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "User Pending Task",
                UserId = userId,
                Status = TaskItemStatus.Pending
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Other User Pending Task",
                UserId = otherUserId,
                Status = TaskItemStatus.Pending
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Other User Completed Task",
                UserId = otherUserId,
                Status = TaskItemStatus.Completed
            }
        );

        await context.SaveChangesAsync();

        var service = new DashboardService(context);

        // Act
        var result = await service.GetDashboardStatsAsync(userId);

        // Assert
        Assert.Equal(1, result.PendingTasks);
        Assert.Equal(0, result.InProgressTasks);
        Assert.Equal(0, result.CompletedTasks);
    }

    [Fact]
    public async Task GetDashboardStatsAsync_ShouldReturnZero_WhenUserHasNoTasks()
    {
        // Arrange
        await using var context = CreateContext();

        var service = new DashboardService(context);

        // Act
        var result = await service.GetDashboardStatsAsync("user-with-no-tasks");

        // Assert
        Assert.NotNull(result);
        Assert.Equal(0, result.PendingTasks);
        Assert.Equal(0, result.InProgressTasks);
        Assert.Equal(0, result.CompletedTasks);
    }
}