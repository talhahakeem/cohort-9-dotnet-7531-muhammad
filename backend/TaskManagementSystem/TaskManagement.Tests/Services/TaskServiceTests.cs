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
    public async Task GetAllAsync_ShouldReturnOnlyOwnTasks_WhenUserIsNotAdmin()
    {
        // Arrange
        await using var context = CreateContext();

        var userId = "user-1";

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
                UserId = "user-2"
            });

        await context.SaveChangesAsync();

        var service = new TaskService(context);

        // Act
        var result = await service.GetAllAsync(userId, false);

        // Assert
        Assert.Single(result);
        Assert.Equal("User Task", result.First().Title);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllTasks_WhenUserIsAdmin()
    {
        // Arrange
        await using var context = CreateContext();

        context.Tasks.AddRange(
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "User 1 Task",
                Category = "Development",
                DueDate = DateTime.UtcNow.AddDays(2),
                Priority = TaskPriority.High,
                Status = TaskItemStatus.Pending,
                UserId = "user-1"
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "User 2 Task",
                Category = "Testing",
                DueDate = DateTime.UtcNow.AddDays(1),
                Priority = TaskPriority.Low,
                Status = TaskItemStatus.Completed,
                UserId = "user-2"
            });

        await context.SaveChangesAsync();

        var service = new TaskService(context);

        // Act
        var result = await service.GetAllAsync("admin-1", true);

        // Assert
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnOwnTask_WhenUserIsNotAdmin()
    {
        // Arrange
        await using var context = CreateContext();

        var userId = "user-1";
        var taskId = Guid.NewGuid();

        context.Tasks.Add(new TaskItem
        {
            Id = taskId,
            Title = "My Task",
            Description = "My task description",
            Category = "Development",
            DueDate = DateTime.UtcNow.AddDays(3),
            Priority = TaskPriority.High,
            Status = TaskItemStatus.Pending,
            UserId = userId
        });

        await context.SaveChangesAsync();

        var service = new TaskService(context);

        // Act
        var result = await service.GetByIdAsync(taskId, userId, false);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(taskId, result.Id);
        Assert.Equal("My Task", result.Title);
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
            Category = "Development",
            DueDate = DateTime.UtcNow.AddDays(3),
            Priority = TaskPriority.High,
            Status = TaskItemStatus.Pending,
            UserId = "user-1"
        });

        await context.SaveChangesAsync();

        var service = new TaskService(context);

        // Act
        var result = await service.GetByIdAsync(
            taskId,
            "user-2",
            false);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnAnyTask_WhenUserIsAdmin()
    {
        // Arrange
        await using var context = CreateContext();

        var taskId = Guid.NewGuid();

        context.Tasks.Add(new TaskItem
        {
            Id = taskId,
            Title = "Any User Task",
            Category = "Development",
            DueDate = DateTime.UtcNow.AddDays(3),
            Priority = TaskPriority.High,
            Status = TaskItemStatus.Pending,
            UserId = "user-1"
        });

        await context.SaveChangesAsync();

        var service = new TaskService(context);

        // Act
        var result = await service.GetByIdAsync(
            taskId,
            "admin-1",
            true);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(taskId, result.Id);
    }

    [Fact]
    public async Task CreateAsync_ShouldCreateTaskForCurrentUser_WhenUserIsNotAdmin()
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
            Status = TaskItemStatus.Pending,
            Priority = TaskPriority.High
        };

        // Act
        var result = await service.CreateAsync(
            request,
            userId,
            false);

        // Assert
        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal("New Task", result.Title);
        Assert.Equal(TaskItemStatus.Pending, result.Status);
        Assert.Equal(TaskPriority.High, result.Priority);

        var savedTask = await context.Tasks.FirstAsync();

        Assert.Equal(userId, savedTask.UserId);
    }

    [Fact]
    public async Task CreateAsync_ShouldAssignTaskToSpecifiedUser_WhenAdminProvidesAssignedUserId()
    {
        // Arrange
        await using var context = CreateContext();

        var service = new TaskService(context);

        var adminId = "admin-1";
        var assignedUserId = "user-2";

        var request = new CreateTaskRequest
        {
            Title = "Assigned Task",
            Description = "Task created by admin",
            Category = "Testing",
            DueDate = DateTime.UtcNow.AddDays(5),
            Status = TaskItemStatus.Pending,
            Priority = TaskPriority.High,
            AssignedUserId = assignedUserId
        };

        // Act
        var result = await service.CreateAsync(
            request,
            adminId,
            true);

        // Assert
        Assert.NotEqual(Guid.Empty, result.Id);

        var savedTask = await context.Tasks.FirstAsync();

        Assert.Equal(assignedUserId, savedTask.UserId);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateOwnTask_WhenUserIsNotAdmin()
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
        var result = await service.UpdateAsync(
            taskId,
            request,
            userId,
            false);

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
    public async Task UpdateAsync_ShouldReturnFalse_WhenTaskBelongsToAnotherUser()
    {
        // Arrange
        await using var context = CreateContext();

        var taskId = Guid.NewGuid();

        context.Tasks.Add(new TaskItem
        {
            Id = taskId,
            Title = "Existing Task",
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
        var result = await service.UpdateAsync(
            taskId,
            request,
            "user-2",
            false);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateAnyTask_WhenUserIsAdmin()
    {
        // Arrange
        await using var context = CreateContext();

        var taskId = Guid.NewGuid();

        context.Tasks.Add(new TaskItem
        {
            Id = taskId,
            Title = "Old Title",
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
            Title = "Admin Updated Task",
            Description = "Updated by admin",
            Category = "Management",
            DueDate = DateTime.UtcNow.AddDays(10),
            Priority = TaskPriority.High,
            Status = TaskItemStatus.Completed
        };

        // Act
        var result = await service.UpdateAsync(
            taskId,
            request,
            "admin-1",
            true);

        // Assert
        Assert.True(result);

        var updatedTask = await context.Tasks.FindAsync(taskId);

        Assert.NotNull(updatedTask);
        Assert.Equal("Admin Updated Task", updatedTask.Title);
        Assert.Equal(TaskItemStatus.Completed, updatedTask.Status);
    }

    [Fact]
    public async Task DeleteAsync_ShouldDeleteOwnTask_WhenUserIsNotAdmin()
    {
        // Arrange
        await using var context = CreateContext();

        var userId = "user-1";
        var taskId = Guid.NewGuid();

        context.Tasks.Add(new TaskItem
        {
            Id = taskId,
            Title = "Task To Delete",
            Category = "Testing",
            DueDate = DateTime.UtcNow.AddDays(2),
            Priority = TaskPriority.Low,
            Status = TaskItemStatus.Pending,
            UserId = userId
        });

        await context.SaveChangesAsync();

        var service = new TaskService(context);

        // Act
        var result = await service.DeleteAsync(
            taskId,
            userId,
            false);

        // Assert
        Assert.True(result);
        Assert.Null(await context.Tasks.FindAsync(taskId));
    }

    [Fact]
    public async Task DeleteAsync_ShouldReturnFalse_WhenTaskBelongsToAnotherUser()
    {
        // Arrange
        await using var context = CreateContext();

        var taskId = Guid.NewGuid();

        context.Tasks.Add(new TaskItem
        {
            Id = taskId,
            Title = "Protected Task",
            Category = "Testing",
            DueDate = DateTime.UtcNow.AddDays(2),
            Priority = TaskPriority.Low,
            Status = TaskItemStatus.Pending,
            UserId = "user-1"
        });

        await context.SaveChangesAsync();

        var service = new TaskService(context);

        // Act
        var result = await service.DeleteAsync(
            taskId,
            "user-2",
            false);

        // Assert
        Assert.False(result);
        Assert.NotNull(await context.Tasks.FindAsync(taskId));
    }

    [Fact]
    public async Task DeleteAsync_ShouldDeleteAnyTask_WhenUserIsAdmin()
    {
        // Arrange
        await using var context = CreateContext();

        var taskId = Guid.NewGuid();

        context.Tasks.Add(new TaskItem
        {
            Id = taskId,
            Title = "Admin Delete Task",
            Category = "Testing",
            DueDate = DateTime.UtcNow.AddDays(2),
            Priority = TaskPriority.Low,
            Status = TaskItemStatus.Pending,
            UserId = "user-1"
        });

        await context.SaveChangesAsync();

        var service = new TaskService(context);

        // Act
        var result = await service.DeleteAsync(
            taskId,
            "admin-1",
            true);

        // Assert
        Assert.True(result);
        Assert.Null(await context.Tasks.FindAsync(taskId));
    }
}