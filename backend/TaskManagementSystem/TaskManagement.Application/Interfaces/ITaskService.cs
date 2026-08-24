using TaskManagement.Application.DTOs.Tasks;

namespace TaskManagement.Application.Interfaces;

public interface ITaskService
{
    Task<IEnumerable<TaskResponse>> GetAllAsync(string userId);

    Task<TaskResponse?> GetByIdAsync(Guid id, string userId);

    Task<TaskResponse> CreateAsync(CreateTaskRequest request, string userId);

    Task<bool> UpdateAsync(Guid id, UpdateTaskRequest request, string userId);

    Task<bool> DeleteAsync(Guid id, string userId);
}