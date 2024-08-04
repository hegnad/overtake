using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace Overtake.Auth;

/// <summary>
/// A mock authentication handler for demo purposes only. It reads the user ID directly from the
/// bearer token without any validation attempt. It's only meant to enable rapid early development.
/// </summary>
public class MockAuthenticationHandler : AuthenticationHandler<MockAuthenticationOptions>
{
    public MockAuthenticationHandler(IOptionsMonitor<MockAuthenticationOptions> options, ILoggerFactory logger, UrlEncoder encoder)
        : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var authHeader = Request.Headers["Authorization"];
        var authHeaderValue = authHeader.FirstOrDefault();
        if (string.IsNullOrEmpty(authHeaderValue))
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        if (!authHeaderValue.StartsWith("Bearer "))
        {
            return Task.FromResult(AuthenticateResult.Fail("unsupported auth type"));
        }

        int userId = Convert.ToInt32(authHeaderValue.Substring("Bearer ".Length));

        var claims = new List<Claim> { new Claim("userId", userId.ToString()) };
        var identity = new ClaimsIdentity(claims);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "mock_auth");

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
