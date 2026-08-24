namespace TaskManagement.Application.DTOs.Tasks;

using System.ComponentModel.DataAnnotations;
using TaskManagement.Domain.Enums;

public class CreateTaskRequest
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required]
    public DateTime DueDate { get; set; }

    [Required]
    public TaskItemStatus Status { get; set; }

    [Required]
    public TaskPriority Priority { get; set; }

    // Optional - Admin kisi user ko assign kar sakta hai
    public string? AssignedUserId { get; set; }
}