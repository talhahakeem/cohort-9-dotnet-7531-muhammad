using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.DTOs.Tasks;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Enums;
using TaskManagement.Infrastructure.Data;

namespace TaskManagement.Infrastructure.Services;

public class TaskService : ITaskService
{
    private readonly ApplicationDbContext _context;

    public TaskService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskResponse>> GetAllAsync(string userId)
    {
        var tasks = await _context.Tasks
            .Where(t => t.UserId == userId)
            .OrderBy(t => t.DueDate)
            .Select(t => new TaskResponse
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                Status = t.Status,
                Priority = t.Priority
            })
            .ToListAsync();

        return tasks;
    }

    public async Task<TaskResponse?> GetByIdAsync(Guid id, string userId)
    {
        var task = await _context.Tasks
            .Where(t => t.Id == id && t.UserId == userId)
            .Select(t => new TaskResponse
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                Status = t.Status,
                Priority = t.Priority
            })
            .FirstOrDefaultAsync();

        return task;
    }

    public async Task<TaskResponse> CreateAsync(CreateTaskRequest request, string userId)
    {
        var task = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            DueDate = request.DueDate,
            Priority = request.Priority,
            Status = TaskItemStatus.Pending,
            UserId = userId
        };

        _context.Tasks.Add(task);

        await _context.SaveChangesAsync();

        return new TaskResponse
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            DueDate = task.DueDate,
            Status = task.Status,
            Priority = task.Priority
        };
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateTaskRequest request, string userId)
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (task == null)
            return false;

        task.Title = request.Title;
        task.Description = request.Description;
        task.DueDate = request.DueDate;
        task.Status = request.Status;
        task.Priority = request.Priority;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, string userId)
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (task == null)
            return false;

        _context.Tasks.Remove(task);

        await _context.SaveChangesAsync();

        return true;
    }
}