using Budget.Domain.Common;
using Budget.Domain.Enums;
using Budget.Domain.Exceptions;
using Budget.Domain.ValueObjects;

namespace Budget.Domain.Entities;

public class Transaction : BaseEntity
{
    public string Title { get; private set; } = string.Empty;
    public Money Money { get; private set; } = null!;
    public TransactionType Type { get; private set; }
    public string Category { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public DateOnly Date { get; private set; }
    public string UserId { get; private set; } = string.Empty;

    public decimal Amount => Money.Amount;
    public string Currency => Money.Currency;

    private Transaction()
    {
    }

    public static Transaction Create(
        string title,
        decimal amount,
        string currency,
        TransactionType type,
        string category,
        string? description,
        DateOnly date,
        string userId)
    {
        ValidateText(title, nameof(title));
        ValidateText(category, nameof(category));
        ValidateText(userId, nameof(userId));

        return new Transaction
        {
            Title = title.Trim(),
            Money = new Money(amount, currency),
            Type = type,
            Category = category.Trim(),
            Description = string.IsNullOrWhiteSpace(description) ? null : description.Trim(),
            Date = date,
            UserId = userId.Trim()
        }.CreateWithMetadata();
    }

    public void Update(
        string title,
        decimal amount,
        string currency,
        TransactionType type,
        string category,
        string? description,
        DateOnly date)
    {
        ValidateText(title, nameof(title));
        ValidateText(category, nameof(category));

        Title = title.Trim();
        Money = new Money(amount, currency);
        Type = type;
        Category = category.Trim();
        Description = string.IsNullOrWhiteSpace(description) ? null : description.Trim();
        Date = date;
        MarkAsUpdated();
    }

    private static void ValidateText(string value, string fieldName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new DomainException($"{fieldName} is required.");
        }
    }

    private Transaction CreateWithMetadata()
    {
        MarkAsCreated(Guid.NewGuid());
        return this;
    }
}
