using Microsoft.AspNetCore.Identity;
using Moq;
using TaskManagement.Infrastructure.Identity;
using TaskManagement.Infrastructure.Services;

namespace TaskManagement.Tests.Services;

public class ProfileServiceTests
{
    [Fact]
    public async Task GetProfileAsync_ShouldReturnProfile_WhenUserExists()
    {
        // Arrange
        var userId = "user-1";

        var user = new ApplicationUser
        {
            Id = userId,
            FirstName = "Muhammad",
            LastName = "Talha",
            Email = "talha@test.com"
        };

        var userManagerMock = new Mock<UserManager<ApplicationUser>>(
            Mock.Of<IUserStore<ApplicationUser>>(),
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!);

        userManagerMock
            .Setup(x => x.FindByIdAsync(userId))
            .ReturnsAsync(user);

        userManagerMock
            .Setup(x => x.GetRolesAsync(user))
            .ReturnsAsync(new List<string> { "User" });

        var service = new ProfileService(userManagerMock.Object);

        // Act
        var result = await service.GetProfileAsync(userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(userId, result.Id);
        Assert.Equal("Muhammad Talha", result.FullName);
        Assert.Equal("talha@test.com", result.Email);
        Assert.Equal("User", result.Role);
    }

    [Fact]
    public async Task GetProfileAsync_ShouldReturnNull_WhenUserDoesNotExist()
    {
        // Arrange
        var userId = "invalid-user";

        var userManagerMock = new Mock<UserManager<ApplicationUser>>(
            Mock.Of<IUserStore<ApplicationUser>>(),
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!);

        userManagerMock
            .Setup(x => x.FindByIdAsync(userId))
            .ReturnsAsync((ApplicationUser?)null);

        var service = new ProfileService(userManagerMock.Object);

        // Act
        var result = await service.GetProfileAsync(userId);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetProfileAsync_ShouldReturnEmptyRole_WhenUserHasNoRoles()
    {
        // Arrange
        var userId = "user-2";

        var user = new ApplicationUser
        {
            Id = userId,
            FirstName = "Test",
            LastName = "User",
            Email = "test@test.com"
        };

        var userManagerMock = new Mock<UserManager<ApplicationUser>>(
            Mock.Of<IUserStore<ApplicationUser>>(),
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!);

        userManagerMock
            .Setup(x => x.FindByIdAsync(userId))
            .ReturnsAsync(user);

        userManagerMock
            .Setup(x => x.GetRolesAsync(user))
            .ReturnsAsync(new List<string>());

        var service = new ProfileService(userManagerMock.Object);

        // Act
        var result = await service.GetProfileAsync(userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(userId, result.Id);
        Assert.Equal("Test User", result.FullName);
        Assert.Equal("test@test.com", result.Email);
        Assert.Equal(string.Empty, result.Role);
    }
}