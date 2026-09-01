namespace TaskManagement.Application.DTOs.Auth;

public class AuthResult
{
    public bool Succeeded { get; set; }

    public List<string> Errors { get; set; } = new();

    public static AuthResult Success() => new() { Succeeded = true };

    public static AuthResult Failure(params string[] errors) =>
        new()
        {
            Succeeded = false,
            Errors = errors.Where(error => !string.IsNullOrWhiteSpace(error)).ToList()
        };
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;

    public DateTime Expiration { get; set; }
}