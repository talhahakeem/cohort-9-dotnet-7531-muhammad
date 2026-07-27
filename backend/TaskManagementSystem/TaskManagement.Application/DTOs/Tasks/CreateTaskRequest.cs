using TaskManagement.Domain.Enums;

namespace TaskManagement.Application.DTOs.Tasks;

public class CreateTaskRequest
{
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime DueDate { get; set; }

    public TaskPriority Priority { get; set; }
}