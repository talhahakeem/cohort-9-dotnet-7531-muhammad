using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.DTOs.Dashboard;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Enums;
using TaskManagement.Infrastructure.Data;

namespace TaskManagement.Infrastructure.Services;

public class DashboardService : IDashboardService
{
    private readonly ApplicationDbContext _context;

    public DashboardService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsResponse> GetDashboardStatsAsync(string userId)
    {
        var tasks = _context.Tasks.Where(t => t.UserId == userId);

        return new DashboardStatsResponse
        {
            PendingTasks = await tasks.CountAsync(t => t.Status == TaskItemStatus.Pending),

            InProgressTasks = await tasks.CountAsync(t => t.Status == TaskItemStatus.InProgress),

            CompletedTasks = await tasks.CountAsync(t => t.Status == TaskItemStatus.Completed)
        };
    }
}