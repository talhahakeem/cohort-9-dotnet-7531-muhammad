using Microsoft.AspNetCore.Identity;
using TaskManagement.Application.DTOs.Profile;
using TaskManagement.Application.Interfaces;
using TaskManagement.Infrastructure.Identity;

namespace TaskManagement.Infrastructure.Services;

public class ProfileService : IProfileService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public ProfileService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<ProfileResponse?> GetProfileAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return null;

        var roles = await _userManager.GetRolesAsync(user);

        return new ProfileResponse
        {
            Id = user.Id,
            FullName = $"{user.FirstName} {user.LastName}",
            Email = user.Email ?? string.Empty,
            Role = roles.FirstOrDefault() ?? string.Empty
        };
    }
}