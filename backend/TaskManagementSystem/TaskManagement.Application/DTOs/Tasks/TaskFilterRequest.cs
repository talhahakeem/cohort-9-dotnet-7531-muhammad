using TaskManagement.Domain.Enums;

namespace TaskManagement.Application.DTOs.Tasks;

public class TaskFilterRequest
{
    public TaskItemStatus? Status { get; set; }

    public TaskPriority? Priority { get; set; }
}