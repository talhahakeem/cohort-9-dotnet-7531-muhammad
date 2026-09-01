namespace TaskManagement.Application.DTOs.Dashboard;

public class DashboardStatsResponse
{
    public int PendingTasks { get; set; }

    public int InProgressTasks { get; set; }

    public int CompletedTasks { get; set; }
}