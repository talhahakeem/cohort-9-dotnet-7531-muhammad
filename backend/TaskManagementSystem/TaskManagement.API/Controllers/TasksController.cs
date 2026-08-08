using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.DTOs.Tasks;
using TaskManagement.Application.Interfaces;

namespace TaskManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(ClaimTypes.Name)
            ?? throw new UnauthorizedAccessException("User ID not found.");
    }

    private bool IsAdmin()
    {
        return User.IsInRole("Admin");
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
    [FromQuery] string? search = null,
    [FromQuery] string? status = null,
    [FromQuery] string? priority = null,
    [FromQuery] string? category = null)
    {
        var tasks = await _taskService.GetAllAsync(
            GetUserId(),
            IsAdmin(),
            search,
            status,
            priority,
            category);

        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var task = await _taskService.GetByIdAsync(
            id,
            GetUserId(),
            IsAdmin());

        if (task == null)
            return NotFound();

        return Ok(task);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTaskRequest request)
    {
        var task = await _taskService.CreateAsync(
            request,
            GetUserId(),
            IsAdmin());

        return CreatedAtAction(
            nameof(GetById),
            new { id = task.Id },
            task);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateTaskRequest request)
    {
        var result = await _taskService.UpdateAsync(
            id,
            request,
            GetUserId(),
            IsAdmin());

        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _taskService.DeleteAsync(
            id,
            GetUserId(),
            IsAdmin());

        if (!result)
            return NotFound();

        return NoContent();
    }
}