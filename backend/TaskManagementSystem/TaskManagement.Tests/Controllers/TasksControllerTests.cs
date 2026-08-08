using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskManagement.API.Controllers;
using TaskManagement.Application.DTOs.Tasks;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Enums;

namespace TaskManagement.Tests.Controllers;

public class TasksControllerTests
{
    private readonly Mock<ITaskService> _taskServiceMock;
    private readonly TasksController _controller;

    public TasksControllerTests()
    {
        _taskServiceMock = new Mock<ITaskService>();
        _controller = new TasksController(_taskServiceMock.Object);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, "user-1")
        };

        var identity = new ClaimsIdentity(claims, "TestAuth");
        var principal = new ClaimsPrincipal(identity);

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = principal
            }
        };
    }

    [Fact]
    public async Task GetAll_ShouldReturnOk_WithUserTasks()
    {
        // Arrange
        var tasks = new List<TaskResponse>
        {
            new TaskResponse
            {
                Id = Guid.NewGuid(),
                Title = "Test Task",
                Description = "Test Description",
                Category = "Development",
                Status = TaskItemStatus.Pending,
                Priority = TaskPriority.High
            }
        };

        _taskServiceMock
    .Setup(x => x.GetAllAsync(
        "user-1",
        false,
        null,
        null,
        null,
        null))
    .ReturnsAsync(tasks);

        // Act
        var result = await _controller.GetAll();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(tasks, okResult.Value);

        _taskServiceMock.Verify(
            x => x.GetAllAsync(
                "user-1",
                false,
                null,
                null,
                null,
                null),
            Times.Once);  
    }

    [Fact]
    public async Task GetById_ShouldReturnOk_WhenTaskExists()
    {
        // Arrange
        var taskId = Guid.NewGuid();

        var task = new TaskResponse
        {
            Id = taskId,
            Title = "Test Task",
            Description = "Test Description",
            Category = "Development",
            Status = TaskItemStatus.Pending,
            Priority = TaskPriority.High
        };

        _taskServiceMock
            .Setup(x => x.GetByIdAsync(taskId, "user-1", false))
            .ReturnsAsync(task);

        // Act
        var result = await _controller.GetById(taskId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(task, okResult.Value);

        _taskServiceMock.Verify(
            x => x.GetByIdAsync(taskId, "user-1", false),
            Times.Once);
    }

    [Fact]
    public async Task GetById_ShouldReturnNotFound_WhenTaskDoesNotExist()
    {
        // Arrange
        var taskId = Guid.NewGuid();

        _taskServiceMock
            .Setup(x => x.GetByIdAsync(taskId, "user-1", false))
            .ReturnsAsync((TaskResponse?)null);

        // Act
        var result = await _controller.GetById(taskId);

        // Assert
        Assert.IsType<NotFoundResult>(result);

        _taskServiceMock.Verify(
            x => x.GetByIdAsync(taskId, "user-1", false),
            Times.Once);
    }

    [Fact]
    public async Task Create_ShouldReturnCreatedAtAction_WhenTaskIsCreated()
    {
        // Arrange
        var taskId = Guid.NewGuid();

        var request = new CreateTaskRequest
        {
            Title = "New Task",
            Description = "New Description",
            Category = "Development",
            DueDate = DateTime.UtcNow.AddDays(5),
            Status = TaskItemStatus.Pending,
            Priority = TaskPriority.High
        };

        var createdTask = new TaskResponse
        {
            Id = taskId,
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            DueDate = request.DueDate,
            Status = TaskItemStatus.Pending,
            Priority = request.Priority
        };

        _taskServiceMock
            .Setup(x => x.CreateAsync(request, "user-1", false))
            .ReturnsAsync(createdTask);

        // Act
        var result = await _controller.Create(request);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result);

        Assert.Equal(
            nameof(TasksController.GetById),
            createdResult.ActionName);

        Assert.Equal(
            taskId,
            createdResult.RouteValues!["id"]);

        Assert.Equal(
            createdTask,
            createdResult.Value);

        _taskServiceMock.Verify(
            x => x.CreateAsync(request, "user-1", false),
            Times.Once);
    }

    [Fact]
    public async Task Update_ShouldReturnNoContent_WhenTaskIsUpdated()
    {
        // Arrange
        var taskId = Guid.NewGuid();

        var request = new UpdateTaskRequest
        {
            Title = "Updated Task",
            Description = "Updated Description",
            Category = "Development",
            DueDate = DateTime.UtcNow.AddDays(10),
            Status = TaskItemStatus.InProgress,
            Priority = TaskPriority.Medium
        };

        _taskServiceMock
            .Setup(x => x.UpdateAsync(
                taskId,
                request,
                "user-1",
                false))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.Update(taskId, request);

        // Assert
        Assert.IsType<NoContentResult>(result);

        _taskServiceMock.Verify(
            x => x.UpdateAsync(
                taskId,
                request,
                "user-1",
                false),
            Times.Once);
    }

    [Fact]
    public async Task Update_ShouldReturnNotFound_WhenTaskDoesNotExist()
    {
        // Arrange
        var taskId = Guid.NewGuid();

        var request = new UpdateTaskRequest
        {
            Title = "Updated Task",
            Description = "Updated Description",
            Category = "Development",
            DueDate = DateTime.UtcNow.AddDays(10),
            Status = TaskItemStatus.InProgress,
            Priority = TaskPriority.Medium
        };

        _taskServiceMock
            .Setup(x => x.UpdateAsync(
                taskId,
                request,
                "user-1",
                false))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.Update(taskId, request);

        // Assert
        Assert.IsType<NotFoundResult>(result);

        _taskServiceMock.Verify(
            x => x.UpdateAsync(
                taskId,
                request,
                "user-1",
                false),
            Times.Once);
    }

    [Fact]
    public async Task Delete_ShouldReturnNoContent_WhenTaskIsDeleted()
    {
        // Arrange
        var taskId = Guid.NewGuid();

        _taskServiceMock
            .Setup(x => x.DeleteAsync(
                taskId,
                "user-1",
                false))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.Delete(taskId);

        // Assert
        Assert.IsType<NoContentResult>(result);

        _taskServiceMock.Verify(
            x => x.DeleteAsync(
                taskId,
                "user-1",
                false),
            Times.Once);
    }

    [Fact]
    public async Task Delete_ShouldReturnNotFound_WhenTaskDoesNotExist()
    {
        // Arrange
        var taskId = Guid.NewGuid();

        _taskServiceMock
            .Setup(x => x.DeleteAsync(
                taskId,
                "user-1",
                false))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.Delete(taskId);

        // Assert
        Assert.IsType<NotFoundResult>(result);

        _taskServiceMock.Verify(
            x => x.DeleteAsync(
                taskId,
                "user-1",
                false),
            Times.Once);
    }
}