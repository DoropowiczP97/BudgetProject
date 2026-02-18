using Budget.Application.Common.Exceptions;
using Budget.Domain.Exceptions;
using FluentValidation;

namespace Budget.Api.Middleware;

public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            await HandleExceptionAsync(context, exception);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, errors) = exception switch
        {
            DomainException domainException => (
                StatusCodes.Status400BadRequest,
                new[] { domainException.Message }),
            ValidationException validationException => (
                StatusCodes.Status400BadRequest,
                validationException.Errors.Select(error => error.ErrorMessage).ToArray()),
            NotFoundException notFoundException => (
                StatusCodes.Status404NotFound,
                new[] { notFoundException.Message }),
            _ => (
                StatusCodes.Status500InternalServerError,
                new[] { "An unexpected error occurred." })
        };

        context.Response.StatusCode = statusCode;
        return context.Response.WriteAsJsonAsync(new { errors });
    }
}
