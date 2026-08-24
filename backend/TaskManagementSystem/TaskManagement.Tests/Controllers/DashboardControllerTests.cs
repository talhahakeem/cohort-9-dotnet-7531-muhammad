using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskManagement.API.Controllers;
using TaskManagement.Application.DTOs.Dashboard;
using TaskManagement.Application.Interfaces;

namespace TaskManagement.Tests.Controllers;

public class DashboardControllerTests
{
    private readonly Mock<IDashboardService> _dashboardServiceMock;
    private readonly DashboardController _controller;

    public DashboardControllerTests()
    {
        _dashboardServiceMock = new Mock<IDashboardService>();
        _controller = new DashboardController(_dashboardServiceMock.Object);
    }

    private void SetupUser(string? userId)
    {
        var claims = new List<Claim>();

        if (userId != null)
        {
            claims.Add(
                new Claim(ClaimTypes.NameIdentifier, userId));
        }

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
    public async Task GetStats_ShouldReturnOk_WhenUserIsAuthenticated()
    {
        // Arrange
        var userId = "user-1";

        var stats = new DashboardStatsResponse
        {
            PendingTasks = 2,
            InProgressTasks = 1,
            CompletedTasks = 3
        };

        SetupUser(userId);

        _dashboardServiceMock
            .Setup(x => x.GetDashboardStatsAsync(userId))
            .ReturnsAsync(stats);

        // Act
        var result = await _controller.GetStats();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Equal(stats, okResult.Value);

        _dashboardServiceMock.Verify(
            x => x.GetDashboardStatsAsync(userId),
            Times.Once);
    }

    [Fact]
    public async Task GetStats_ShouldThrowUnauthorizedAccessException_WhenUserIdIsMissing()
    {
        // Arrange
        SetupUser(null);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _controller.GetStats());
    }
}