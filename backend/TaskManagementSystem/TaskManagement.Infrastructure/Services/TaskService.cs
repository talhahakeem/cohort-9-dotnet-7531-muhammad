using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.DTOs.Tasks;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Infrastructure.Data;

namespace TaskManagement.Infrastructure.Services;

public class TaskService : ITaskService
{
    private readonly ApplicationDbContext _context;

    public TaskService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskResponse>> GetAllAsync(
        string userId,
        bool isAdmin)
    {
        var query = _context.Tasks.AsQueryable();

        if (!isAdmin)
        {
            query = query.Where(t => t.UserId == userId);
        }

        var tasks = await query
            .OrderBy(t => t.DueDate)
            .Select(t => new TaskResponse
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Category = t.Category,
                DueDate = t.DueDate,
                Status = t.Status,
                Priority = t.Priority
            })
            .ToListAsync();

        return tasks;
    }

    public async Task<TaskResponse?> GetByIdAsync(
        Guid id,
        string userId,
        bool isAdmin)
    {
        var query = _context.Tasks
            .Where(t => t.Id == id);

        if (!isAdmin)
        {
            query = query.Where(t => t.UserId == userId);
        }

        var task = await query
            .Select(t => new TaskResponse
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Category = t.Category,
                DueDate = t.DueDate,
                Status = t.Status,
                Priority = t.Priority
            })
            .FirstOrDefaultAsync();

        return task;
    }

    public async Task<TaskResponse> CreateAsync(
        CreateTaskRequest request,
        string userId,
        bool isAdmin)
    {
        var taskUserId = userId;

        if (isAdmin &&
            !string.IsNullOrWhiteSpace(request.AssignedUserId))
        {
            taskUserId = request.AssignedUserId;
        }

        var task = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            DueDate = request.DueDate,
            Status = request.Status,
            Priority = request.Priority,
            UserId = taskUserId
        };

        _context.Tasks.Add(task);

        await _context.SaveChangesAsync();

        return new TaskResponse
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Category = task.Category,
            DueDate = task.DueDate,
            Status = task.Status,
            Priority = task.Priority
        };
    }

    public async Task<bool> UpdateAsync(
        Guid id,
        UpdateTaskRequest request,
        string userId,
        bool isAdmin)
    {
        var query = _context.Tasks
            .Where(t => t.Id == id);

        if (!isAdmin)
        {
            query = query.Where(t => t.UserId == userId);
        }

        var task = await query.FirstOrDefaultAsync();

        if (task == null)
            return false;

        task.Title = request.Title;
        task.Description = request.Description;
        task.Category = request.Category;
        task.DueDate = request.DueDate;
        task.Status = request.Status;
        task.Priority = request.Priority;

        if (isAdmin &&
            !string.IsNullOrWhiteSpace(request.AssignedUserId))
        {
            task.UserId = request.AssignedUserId;
        }

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(
        Guid id,
        string userId,
        bool isAdmin)
    {
        var query = _context.Tasks
            .Where(t => t.Id == id);

        if (!isAdmin)
        {
            query = query.Where(t => t.UserId == userId);
        }

        var task = await query.FirstOrDefaultAsync();

        if (task == null)
            return false;

        _context.Tasks.Remove(task);

        await _context.SaveChangesAsync();

        return true;
    }
}