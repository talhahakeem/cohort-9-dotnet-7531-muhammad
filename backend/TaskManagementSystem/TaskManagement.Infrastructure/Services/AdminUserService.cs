using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.DTOs.AdminUsers;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Infrastructure.Data;
using TaskManagement.Infrastructure.Identity;

namespace TaskManagement.Infrastructure.Services;

public class AdminUserService : IAdminUserService
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public AdminUserService(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task<IEnumerable<AdminUserResponse>> GetAllAsync()
    {
        var users = await _userManager.Users
            .OrderBy(u => u.LastName)
            .ThenBy(u => u.FirstName)
            .Select(u => new AdminUserResponse
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email ?? string.Empty,
                Role = _userManager.GetRolesAsync(u).Result.FirstOrDefault() ?? "User",
                Status = "Active",
                TaskCount = _context.Tasks.Count(t => t.UserId == u.Id)
            })
            .ToListAsync();

        return users;
    }

    public async Task<AdminUserResponse?> GetByIdAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return null;

        var roles = await _userManager.GetRolesAsync(user);

        return new AdminUserResponse
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email ?? string.Empty,
            Role = roles.FirstOrDefault() ?? "User",
            Status = "Active",
            TaskCount = await _context.Tasks.CountAsync(t => t.UserId == user.Id)
        };
    }

    public async Task<AdminUserResponse> UpdateAsync(string userId, AdminUserUpdateRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            throw new KeyNotFoundException("User not found.");

        var existingUser = await _userManager.FindByEmailAsync(request.Email);

        if (existingUser != null && existingUser.Id != userId)
            throw new InvalidOperationException("A user with this email already exists.");

        if (string.IsNullOrWhiteSpace(request.FirstName) ||
            string.IsNullOrWhiteSpace(request.LastName) ||
            string.IsNullOrWhiteSpace(request.Email))
            throw new InvalidOperationException("User details are invalid.");

        var allowedRoles = new[] { "User", "Admin" };

        if (!allowedRoles.Contains(request.Role))
            throw new InvalidOperationException("Invalid role selected.");

        user.FirstName = request.FirstName.Trim();
        user.LastName = request.LastName.Trim();
        user.Email = request.Email.Trim();
        user.UserName = request.Email.Trim();

        var updateResult = await _userManager.UpdateAsync(user);

        if (!updateResult.Succeeded)
            throw new InvalidOperationException(string.Join("; ", updateResult.Errors.Select(e => e.Description)));

        var currentRoles = await _userManager.GetRolesAsync(user);
        if (currentRoles.Any())
        {
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
        }

        await _userManager.AddToRoleAsync(user, request.Role);

        var updatedRoles = await _userManager.GetRolesAsync(user);

        return new AdminUserResponse
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email ?? string.Empty,
            Role = updatedRoles.FirstOrDefault() ?? "User",
            Status = "Active",
            TaskCount = await _context.Tasks.CountAsync(t => t.UserId == user.Id)
        };
    }

    public async Task<bool> DeleteAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return false;

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
            return false;

        return true;
    }
}
