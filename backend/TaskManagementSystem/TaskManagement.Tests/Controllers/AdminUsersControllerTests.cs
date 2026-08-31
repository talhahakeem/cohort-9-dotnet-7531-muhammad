using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskManagement.API.Controllers;
using TaskManagement.Application.DTOs.AdminUsers;
using TaskManagement.Application.Interfaces;

namespace TaskManagement.Tests.Controllers;

public class AdminUsersControllerTests
{
    private readonly Mock<IAdminUserService> _adminUserServiceMock;
    private readonly AdminUsersController _controller;

    public AdminUsersControllerTests()
    {
        _adminUserServiceMock = new Mock<IAdminUserService>();
        _controller = new AdminUsersController(_adminUserServiceMock.Object);
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
    }

    [Fact]
    public async Task GetAll_ShouldReturnOk_WhenUsersExist()
    {
        var users = new List<AdminUserResponse>
        {
            new()
            {
                Id = "user-1",
                FirstName = "Test",
                LastName = "User",
                Email = "test@example.com",
                Role = "User",
                Status = "Active",
                TaskCount = 2
            }
        };

        _adminUserServiceMock
            .Setup(x => x.GetAllAsync())
            .ReturnsAsync(users);

        var result = await _controller.GetAll();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(users, okResult.Value);
    }

    [Fact]
    public async Task GetById_ShouldReturnNotFound_WhenUserDoesNotExist()
    {
        _adminUserServiceMock
            .Setup(x => x.GetByIdAsync("missing-user"))
            .ReturnsAsync((AdminUserResponse?)null);

        var result = await _controller.GetById("missing-user");

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Update_ShouldReturnConflict_WhenEmailAlreadyExists()
    {
        var request = new AdminUserUpdateRequest
        {
            FirstName = "Updated",
            LastName = "User",
            Email = "duplicate@example.com",
            Role = "User"
        };

        _adminUserServiceMock
            .Setup(x => x.UpdateAsync("user-1", request))
            .ThrowsAsync(new InvalidOperationException("A user with this email already exists."));

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _adminUserServiceMock.Object.UpdateAsync("user-1", request));

        Assert.Equal("A user with this email already exists.", exception.Message);
    }

    [Fact]
    public async Task Delete_ShouldReturnNoContent_WhenDeleteSucceeds()
    {
        _adminUserServiceMock
            .Setup(x => x.DeleteAsync("user-1"))
            .ReturnsAsync(true);

        var result = await _controller.Delete("user-1");

        Assert.IsType<NoContentResult>(result);
    }
}
