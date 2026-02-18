using System.Security.Claims;

namespace Budget.Api.Common.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static string GetUserId(this ClaimsPrincipal principal)
    {
        return principal.FindFirstValue("sub")
            ?? throw new UnauthorizedAccessException("User id claim is missing.");
    }
}
