using TaskManagement.Application.DTOs.Profile;

namespace TaskManagement.Application.Interfaces;

public interface IProfileService
{
    Task<ProfileResponse?> GetProfileAsync(string userId);
}