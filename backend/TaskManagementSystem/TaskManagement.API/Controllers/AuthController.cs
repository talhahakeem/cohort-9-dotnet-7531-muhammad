using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.DTOs.Auth;
using TaskManagement.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace TaskManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    private static List<string> ValidatePassword(string password)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(password))
        {
            errors.Add("Password is required.");
            return errors;
        }

        if (password.Length < 8)
        {
            errors.Add("Password must be at least 8 characters long.");
        }

        if (!password.Any(char.IsUpper))
        {
            errors.Add("Password must contain at least one uppercase letter.");
        }

        if (!password.Any(char.IsLower))
        {
            errors.Add("Password must contain at least one lowercase letter.");
        }

        if (!password.Any(char.IsDigit))
        {
            errors.Add("Password must contain at least one number.");
        }

        if (!password.Any(ch => !char.IsLetterOrDigit(ch)))
        {
            errors.Add("Password must contain at least one special character.");
        }

        return errors;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var passwordErrors = ValidatePassword(request.Password);
        if (passwordErrors.Count > 0)
        {
            var problemDetails = new ValidationProblemDetails(new Dictionary<string, string[]>
            {
                [nameof(RegisterRequest.Password)] = passwordErrors.ToArray()
            })
            {
                Title = "One or more validation errors occurred."
            };

            return BadRequest(problemDetails);
        }

        if (request.Password != request.ConfirmPassword)
        {
            var problemDetails = new ValidationProblemDetails(new Dictionary<string, string[]>
            {
                [nameof(RegisterRequest.ConfirmPassword)] = new[] { "Passwords do not match." }
            })
            {
                Title = "One or more validation errors occurred."
            };

            return BadRequest(problemDetails);
        }

        var result = await _authService.RegisterAsync(request);

        if (result is null || !result.Succeeded)
        {
            var errors = result?.Errors ?? new List<string> { "Registration failed." };
            var problemDetails = new ValidationProblemDetails(new Dictionary<string, string[]>
            {
                ["Password"] = errors.ToArray()
            })
            {
                Title = "One or more validation errors occurred."
            };

            return BadRequest(problemDetails);
        }

        return Ok("User registered successfully.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var response = await _authService.LoginAsync(request);

        if (response == null)
        {
            return Unauthorized("Invalid email or password.");
        }

        return Ok(response);
    }

    [Authorize]
    [HttpGet("profile")]
    public IActionResult GetProfile()
    {
        return Ok("You are authenticated.");
    }
}