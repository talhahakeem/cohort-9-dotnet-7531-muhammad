using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Moq;
using TaskManagement.Application.DTOs.Auth;
using TaskManagement.Infrastructure.Identity;
using TaskManagement.Infrastructure.Services;
using Xunit;

namespace TaskManagement.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        var userStoreMock = new Mock<IUserStore<ApplicationUser>>();

        _userManagerMock = new Mock<UserManager<ApplicationUser>>(
            userStoreMock.Object,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!);

        _configurationMock = new Mock<IConfiguration>();

        _configurationMock
            .Setup(x => x["Jwt:Key"])
            .Returns("ThisIsASecretKeyForTestingOnly123456789");

        _configurationMock
            .Setup(x => x["Jwt:Issuer"])
            .Returns("TestIssuer");

        _configurationMock
            .Setup(x => x["Jwt:Audience"])
            .Returns("TestAudience");

        _configurationMock
            .Setup(x => x["Jwt:DurationInMinutes"])
            .Returns("60");

        _authService = new AuthService(
            _userManagerMock.Object,
            null!,
            _configurationMock.Object);
    }

    // ---------------------------------------------------------
    // REGISTER TESTS
    // ---------------------------------------------------------

    [Fact]
    public async Task RegisterAsync_ShouldReturnFalse_WhenPasswordsDoNotMatch()
    {
        // Arrange
        var request = new RegisterRequest
        {
            FirstName = "Talha",
            LastName = "Hakeem",
            Email = "talha@test.com",
            Password = "Password123!",
            ConfirmPassword = "DifferentPassword123!"
        };

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        Assert.False(result);

        _userManagerMock.Verify(
            x => x.FindByEmailAsync(It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task RegisterAsync_ShouldReturnFalse_WhenUserAlreadyExists()
    {
        // Arrange
        var existingUser = new ApplicationUser
        {
            Id = "existing-user-id",
            Email = "talha@test.com",
            UserName = "talha@test.com"
        };

        _userManagerMock
            .Setup(x => x.FindByEmailAsync("talha@test.com"))
            .ReturnsAsync(existingUser);

        var request = new RegisterRequest
        {
            FirstName = "Talha",
            LastName = "Hakeem",
            Email = "talha@test.com",
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        };

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        Assert.False(result);

        _userManagerMock.Verify(
            x => x.CreateAsync(
                It.IsAny<ApplicationUser>(),
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task RegisterAsync_ShouldReturnFalse_WhenUserCreationFails()
    {
        // Arrange
        _userManagerMock
            .Setup(x => x.FindByEmailAsync("newuser@test.com"))
            .ReturnsAsync((ApplicationUser?)null);

        _userManagerMock
            .Setup(x => x.CreateAsync(
                It.IsAny<ApplicationUser>(),
                "Password123!"))
            .ReturnsAsync(IdentityResult.Failed(
                new IdentityError
                {
                    Description = "Password is invalid."
                }));

        var request = new RegisterRequest
        {
            FirstName = "New",
            LastName = "User",
            Email = "newuser@test.com",
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        };

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        Assert.False(result);

        _userManagerMock.Verify(
            x => x.AddToRoleAsync(
                It.IsAny<ApplicationUser>(),
                "User"),
            Times.Never);
    }

    [Fact]
    public async Task RegisterAsync_ShouldReturnTrue_WhenRegistrationIsSuccessful()
    {
        // Arrange
        _userManagerMock
            .Setup(x => x.FindByEmailAsync("newuser@test.com"))
            .ReturnsAsync((ApplicationUser?)null);

        _userManagerMock
            .Setup(x => x.CreateAsync(
                It.IsAny<ApplicationUser>(),
                "Password123!"))
            .ReturnsAsync(IdentityResult.Success);

        _userManagerMock
            .Setup(x => x.AddToRoleAsync(
                It.IsAny<ApplicationUser>(),
                "User"))
            .ReturnsAsync(IdentityResult.Success);

        var request = new RegisterRequest
        {
            FirstName = "New",
            LastName = "User",
            Email = "newuser@test.com",
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        };

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        Assert.True(result);

        _userManagerMock.Verify(
            x => x.CreateAsync(
                It.Is<ApplicationUser>(u =>
                    u.Email == "newuser@test.com" &&
                    u.UserName == "newuser@test.com" &&
                    u.FirstName == "New" &&
                    u.LastName == "User"),
                "Password123!"),
            Times.Once);

        _userManagerMock.Verify(
            x => x.AddToRoleAsync(
                It.IsAny<ApplicationUser>(),
                "User"),
            Times.Once);
    }

    // ---------------------------------------------------------
    // LOGIN TESTS
    // ---------------------------------------------------------

    [Fact]
    public async Task LoginAsync_ShouldReturnNull_WhenUserDoesNotExist()
    {
        // Arrange
        _userManagerMock
            .Setup(x => x.FindByEmailAsync("notfound@test.com"))
            .ReturnsAsync((ApplicationUser?)null);

        var request = new LoginRequest
        {
            Email = "notfound@test.com",
            Password = "Password123!"
        };

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.Null(result);

        _userManagerMock.Verify(
            x => x.CheckPasswordAsync(
                It.IsAny<ApplicationUser>(),
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task LoginAsync_ShouldReturnNull_WhenPasswordIsInvalid()
    {
        // Arrange
        var user = new ApplicationUser
        {
            Id = "user-id",
            Email = "talha@test.com",
            UserName = "talha@test.com"
        };

        _userManagerMock
            .Setup(x => x.FindByEmailAsync("talha@test.com"))
            .ReturnsAsync(user);

        _userManagerMock
            .Setup(x => x.CheckPasswordAsync(
                user,
                "WrongPassword123!"))
            .ReturnsAsync(false);

        var request = new LoginRequest
        {
            Email = "talha@test.com",
            Password = "WrongPassword123!"
        };

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.Null(result);

        _userManagerMock.Verify(
            x => x.GetRolesAsync(It.IsAny<ApplicationUser>()),
            Times.Never);
    }

    [Fact]
    public async Task LoginAsync_ShouldReturnAuthResponse_WhenCredentialsAreValid()
    {
        // Arrange
        var user = new ApplicationUser
        {
            Id = "user-id",
            Email = "talha@test.com",
            UserName = "talha@test.com"
        };

        _userManagerMock
            .Setup(x => x.FindByEmailAsync("talha@test.com"))
            .ReturnsAsync(user);

        _userManagerMock
            .Setup(x => x.CheckPasswordAsync(
                user,
                "Password123!"))
            .ReturnsAsync(true);

        _userManagerMock
            .Setup(x => x.GetRolesAsync(user))
            .ReturnsAsync(new List<string> { "User" });

        var request = new LoginRequest
        {
            Email = "talha@test.com",
            Password = "Password123!"
        };

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.False(string.IsNullOrWhiteSpace(result!.Token));
        Assert.True(result.Expiration > DateTime.UtcNow);

        // Verify that the generated token is a valid JWT format.
        var handler = new JwtSecurityTokenHandler();

        var jwt = handler.ReadJwtToken(result.Token);

        Assert.Contains(
            jwt.Claims,
            claim => claim.Type == "email" &&
                     claim.Value == "talha@test.com");

        Assert.Contains(
            jwt.Claims,
            claim => claim.Type ==
                     System.Security.Claims.ClaimTypes.Role &&
                     claim.Value == "User");
    }
}