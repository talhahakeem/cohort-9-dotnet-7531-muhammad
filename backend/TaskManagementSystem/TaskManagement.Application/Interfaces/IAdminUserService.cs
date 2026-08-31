using TaskManagement.Application.DTOs.AdminUsers;

namespace TaskManagement.Application.Interfaces;

public interface IAdminUserService
{
    Task<IEnumerable<AdminUserResponse>> GetAllAsync();

    Task<AdminUserResponse?> GetByIdAsync(string userId);

    Task<AdminUserResponse> UpdateAsync(string userId, AdminUserUpdateRequest request);

    Task<bool> DeleteAsync(string userId);
}
