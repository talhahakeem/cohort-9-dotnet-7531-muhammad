using TaskManagement.Domain.Enums;

namespace TaskManagement.Application.DTOs.Tasks;

public class UpdateTaskRequest
{
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime DueDate { get; set; }

    public TaskItemStatus Status { get; set; }

    public TaskPriority Priority { get; set; }
}