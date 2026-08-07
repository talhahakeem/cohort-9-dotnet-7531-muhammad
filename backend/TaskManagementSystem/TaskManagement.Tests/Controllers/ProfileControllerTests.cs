using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskManagement.API.Controllers;
using TaskManagement.Application.DTOs.Profile;
using TaskManagement.Application.Interfaces;

namespace TaskManagement.Tests.Controllers;

public class ProfileControllerTests
{
    private readonly Mock<IProfileService> _profileServiceMock;
    private readonly ProfileController _controller;

    public ProfileControllerTests()
    {
        _profileServiceMock = new Mock<IProfileService>();
        _controller = new ProfileController(_profileServiceMock.Object);
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
    public async Task GetProfile_ShouldReturnOk_WhenProfileExists()
    {
        // Arrange
        var userId = "user-1";

        var profile = new ProfileResponse
        {
            Id = userId,
            FullName = "Test User",
            Email = "test@example.com",
            Role = "User"
        };

        SetupUser(userId);

        _profileServiceMock
            .Setup(x => x.GetProfileAsync(userId))
            .ReturnsAsync(profile);

        // Act
        var result = await _controller.GetProfile();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Equal(profile, okResult.Value);

        _profileServiceMock.Verify(
            x => x.GetProfileAsync(userId),
            Times.Once);
    }

    [Fact]
    public async Task GetProfile_ShouldReturnNotFound_WhenProfileDoesNotExist()
    {
        // Arrange
        var userId = "user-1";

        SetupUser(userId);

        _profileServiceMock
            .Setup(x => x.GetProfileAsync(userId))
            .ReturnsAsync((ProfileResponse?)null);

        // Act
        var result = await _controller.GetProfile();

        // Assert
        Assert.IsType<NotFoundResult>(result);

        _profileServiceMock.Verify(
            x => x.GetProfileAsync(userId),
            Times.Once);
    }

    [Fact]
    public async Task GetProfile_ShouldReturnUnauthorized_WhenUserIdIsMissing()
    {
        // Arrange
        SetupUser(null);

        // Act
        var result = await _controller.GetProfile();

        // Assert
        Assert.IsType<UnauthorizedResult>(result);

        _profileServiceMock.Verify(
            x => x.GetProfileAsync(It.IsAny<string>()),
            Times.Never);
    }
}