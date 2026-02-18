using Budget.Domain.Enums;

namespace Budget.Application.Transactions.Common;

public sealed class TransactionDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public decimal Amount { get; init; }
    public string Currency { get; init; } = string.Empty;
    public TransactionType Type { get; init; }
    public string Category { get; init; } = string.Empty;
    public string? Description { get; init; }
    public DateOnly Date { get; init; }
    public DateTime CreatedAt { get; init; }
}
