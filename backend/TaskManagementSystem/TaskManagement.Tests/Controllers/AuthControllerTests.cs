using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskManagement.API.Controllers;
using TaskManagement.Application.DTOs.Auth;
using TaskManagement.Application.Interfaces;

namespace TaskManagement.Tests.Controllers;

public class AuthControllerTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _controller = new AuthController(_authServiceMock.Object);
    }

    [Fact]
    public async Task Register_ShouldReturnOk_WhenRegistrationSucceeds()
    {
        // Arrange
        var request = new RegisterRequest
        {
            FirstName = "Test",
            LastName = "User",
            Email = "test@example.com",
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        };

        _authServiceMock
            .Setup(x => x.RegisterAsync(request))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.Register(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            "User registered successfully.",
            okResult.Value);

        _authServiceMock.Verify(
            x => x.RegisterAsync(request),
            Times.Once);
    }

    [Fact]
    public async Task Register_ShouldReturnBadRequest_WhenRegistrationFails()
    {
        // Arrange
        var request = new RegisterRequest
        {
            FirstName = "Test",
            LastName = "User",
            Email = "test@example.com",
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        };

        _authServiceMock
            .Setup(x => x.RegisterAsync(request))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.Register(request);

        // Assert
        var badRequestResult =
            Assert.IsType<BadRequestObjectResult>(result);

        Assert.Equal(
            "Registration failed.",
            badRequestResult.Value);
    }

    [Fact]
    public async Task Login_ShouldReturnOk_WhenCredentialsAreValid()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "test@example.com",
            Password = "Password123!"
        };

        var response = new AuthResponse
        {
            Token = "test-jwt-token",
            Expiration = DateTime.UtcNow.AddMinutes(30)
        };

        _authServiceMock
            .Setup(x => x.LoginAsync(request))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.Login(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Equal(response, okResult.Value);

        _authServiceMock.Verify(
            x => x.LoginAsync(request),
            Times.Once);
    }

    [Fact]
    public async Task Login_ShouldReturnUnauthorized_WhenCredentialsAreInvalid()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "wrong@example.com",
            Password = "WrongPassword"
        };

        _authServiceMock
            .Setup(x => x.LoginAsync(request))
            .ReturnsAsync((AuthResponse?)null);

        // Act
        var result = await _controller.Login(request);

        // Assert
        var unauthorizedResult =
            Assert.IsType<UnauthorizedObjectResult>(result);

        Assert.Equal(
            "Invalid email or password.",
            unauthorizedResult.Value);
    }

    [Fact]
    public void GetProfile_ShouldReturnOk_WhenCalled()
    {
        // Act
        var result = _controller.GetProfile();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            "You are authenticated.",
            okResult.Value);
    }
}