using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.DTOs.Tasks;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Enums;
using TaskManagement.Infrastructure.Data;
using TaskManagement.Infrastructure.Services;

namespace TaskManagement.Tests.Services;

public class TaskServiceTests
{
    private ApplicationDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnOnlyTasksBelongingToUser()
    {
        // Arrange
        await using var context = CreateContext();

        var userId = "user-1";
        var otherUserId = "user-2";

        context.Tasks.AddRange(
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "User Task",
                Description = "User task description",
                Category = "Development",
                DueDate = DateTime.UtcNow.AddDays(2),
                Priority = TaskPriority.High,
                Status = TaskItemStatus.Pending,
                UserId = userId
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Other User Task",
                Description = "Other task description",
                Category = "Testing",
                DueDate = DateTime.UtcNow.AddDays(1),
                Priority = TaskPriority.Low,
                Status = TaskItemStatus.Pending,
                UserId = otherUserId
            });

        await context.SaveChangesAsync();

        var service = new TaskService(context);

        // Act
        var result = await service.GetAllAsync(userId);

        // Assert
        Assert.Single(result);
        Assert.Equal("User Task", result.First().Title);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnTask_WhenTaskBelongsToUser()
    {
        // Arrange
        await using var context = CreateContext();

        var userId = "user-1";
        var taskId = Guid.NewGuid();

        context.Tasks.Add(new TaskItem
        {
            Id = taskId,
            Title = "Test Task",
            Description = "Test description",
            Category = "Development",
            DueDate = DateTime.UtcNow.AddDays(3),
            Priority = TaskPriority.High,
            Status = TaskItemStatus.Pending,
            UserId = userId
        });

        await context.SaveChangesAsync();

        var service = new TaskService(context);

        // Act
        var result = await service.GetByIdAsync(taskId, userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(taskId, result.Id);
        Assert.Equal("Test Task", result.Title);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnNull_WhenTaskBelongsToAnotherUser()
    {
        // Arrange
        await using var context = CreateContext();

        var taskId = Guid.NewGuid();

        context.Tasks.Add(new TaskItem
        {
            Id = taskId,
            Title = "Private Task",
            Description = "Private description",
            Category = "Development",
            DueDate = DateTime.UtcNow.AddDays(3),
            Priority = TaskPriority.High,
            Status = TaskItemStatus.Pending,
            UserId = "user-1"
        });

        await context.SaveChangesAsync();

        var service = new TaskService(context);

        // Act
        var result = await service.GetByIdAsync(taskId, "user-2");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task CreateAsync_ShouldCreateTask_WithPendingStatus()
    {
        // Arrange
        await using var context = CreateContext();

        var service = new TaskService(context);

        var userId = "user-1";

        var request = new CreateTaskRequest
        {
            Title = "New Task",
            Description = "New task description",
            Category = "Development",
            DueDate = DateTime.UtcNow.AddDays(5),
            Priority = TaskPriority.High
        };

        // Act
        var result = await service.CreateAsync(request, userId);

        // Assert
        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal("New Task", result.Title);
        Assert.Equal("New task description", result.Description);
        Assert.Equal("Development", result.Category);
        Assert.Equal(TaskPriority.High, result.Priority);
        Assert.Equal(TaskItemStatus.Pending, result.Status);
        Assert.Equal(1, await context.Tasks.CountAsync());

        var savedTask = await context.Tasks.FirstAsync();

        Assert.Equal(userId, savedTask.UserId);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateTask_WhenTaskBelongsToUser()
    {
        // Arrange
        await using var context = CreateContext();

        var userId = "user-1";
        var taskId = Guid.NewGuid();

        context.Tasks.Add(new TaskItem
        {
            Id = taskId,
            Title = "Old Title",
            Description = "Old description",
            Category = "Development",
            DueDate = DateTime.UtcNow.AddDays(2),
            Priority = TaskPriority.Low,
            Status = TaskItemStatus.Pending,
            UserId = userId
        });

        await context.SaveChangesAsync();

        var service = new TaskService(context);

        var request = new UpdateTaskRequest
        {
            Title = "Updated Title",
            Description = "Updated description",
            Category = "Testing",
            DueDate = DateTime.UtcNow.AddDays(10),
            Priority = TaskPriority.High,
            Status = TaskItemStatus.InProgress
        };

        // Act
        var result = await service.UpdateAsync(taskId, request, userId);

        // Assert
        Assert.True(result);

        var updatedTask = await context.Tasks.FindAsync(taskId);

        Assert.NotNull(updatedTask);
        Assert.Equal("Updated Title", updatedTask.Title);
        Assert.Equal("Updated description", updatedTask.Description);
        Assert.Equal("Testing", updatedTask.Category);
        Assert.Equal(TaskPriority.High, updatedTask.Priority);
        Assert.Equal(TaskItemStatus.InProgress, updatedTask.Status);
    }

    [Fact]
    public async Task UpdateAsync_ShouldReturnFalse_WhenTaskDoesNotBelongToUser()
    {
        // Arrange
        await using var context = CreateContext();

        var taskId = Guid.NewGuid();

        context.Tasks.Add(new TaskItem
        {
            Id = taskId,
            Title = "Existing Task",
            Description = "Description",
            Category = "Development",
            DueDate = DateTime.UtcNow.AddDays(2),
            Priority = TaskPriority.Low,
            Status = TaskItemStatus.Pending,
            UserId = "user-1"
        });

        await context.SaveChangesAsync();

        var service = new TaskService(context);

        var request = new UpdateTaskRequest
        {
            Title = "Updated Title",
            Description = "Updated description",
            Category = "Testing",
            DueDate = DateTime.UtcNow.AddDays(5),
            Priority = TaskPriority.High,
            Status = TaskItemStatus.Completed
        };

        // Act
        var result = await service.UpdateAsync(taskId, request, "user-2");

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task DeleteAsync_ShouldDeleteTask_WhenTaskBelongsToUser()
    {
        // Arrange
        await using var context = CreateContext();

        var userId = "user-1";
        var taskId = Guid.NewGuid();

        context.Tasks.Add(new TaskItem
        {
            Id = taskId,
            Title = "Task To Delete",
            Description = "Description",
            Category = "Testing",
            DueDate = DateTime.UtcNow.AddDays(2),
            Priority = TaskPriority.Low,
            Status = TaskItemStatus.Pending,
            UserId = userId
        });

        await context.SaveChangesAsync();

        var service = new TaskService(context);

        // Act
        var result = await service.DeleteAsync(taskId, userId);

        // Assert
        Assert.True(result);
        Assert.Null(await context.Tasks.FindAsync(taskId));
    }

    [Fact]
    public async Task DeleteAsync_ShouldReturnFalse_WhenTaskDoesNotBelongToUser()
    {
        // Arrange
        await using var context = CreateContext();

        var taskId = Guid.NewGuid();

        context.Tasks.Add(new TaskItem
        {
            Id = taskId,
            Title = "Protected Task",
            Description = "Description",
            Category = "Testing",
            DueDate = DateTime.UtcNow.AddDays(2),
            Priority = TaskPriority.Low,
            Status = TaskItemStatus.Pending,
            UserId = "user-1"
        });

        await context.SaveChangesAsync();

        var service = new TaskService(context);

        // Act
        var result = await service.DeleteAsync(taskId, "user-2");

        // Assert
        Assert.False(result);
        Assert.NotNull(await context.Tasks.FindAsync(taskId));
    }
}