using Budget.Application.Transactions.Common;
using Budget.Domain.Enums;
using MediatR;

namespace Budget.Application.Transactions.Commands.UpdateTransaction;

public sealed class UpdateTransactionCommand : IRequest<TransactionDto>
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public decimal Amount { get; init; }
    public string Currency { get; init; } = "PLN";
    public TransactionType Type { get; init; }
    public string Category { get; init; } = string.Empty;
    public string? Description { get; init; }
    public DateOnly Date { get; init; }
    public string UserId { get; set; } = string.Empty;

    public UpdateTransactionCommand WithRouteIdAndUserId(Guid id, string userId)
    {
        return new UpdateTransactionCommand
        {
            Id = id,
            Title = Title,
            Amount = Amount,
            Currency = Currency,
            Type = Type,
            Category = Category,
            Description = Description,
            Date = Date,
            UserId = userId
        };
    }
}
