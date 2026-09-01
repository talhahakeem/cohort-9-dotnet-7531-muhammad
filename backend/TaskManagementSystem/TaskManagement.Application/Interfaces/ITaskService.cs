using TaskManagement.Application.DTOs.Tasks;

namespace TaskManagement.Application.Interfaces;

public interface ITaskService
{
    Task<IEnumerable<TaskResponse>> GetAllAsync(
        string userId,
        bool isAdmin,
        string? search = null,
        string? status = null,
        string? priority = null,
        string? category = null);

    Task<TaskResponse?> GetByIdAsync(
        Guid id,
        string userId,
        bool isAdmin);

    Task<TaskResponse> CreateAsync(
        CreateTaskRequest request,
        string userId,
        bool isAdmin);

    Task<bool> UpdateAsync(
        Guid id,
        UpdateTaskRequest request,
        string userId,
        bool isAdmin);

    Task<bool> DeleteAsync(
        Guid id,
        string userId,
        bool isAdmin);
}