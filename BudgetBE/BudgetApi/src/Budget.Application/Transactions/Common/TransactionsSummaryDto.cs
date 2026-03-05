using Budget.Domain.Enums;

namespace Budget.Application.Transactions.Common;

public sealed class TransactionsSummaryDto
{
    public decimal TotalIncome { get; init; }
    public decimal TotalExpenses { get; init; }
    public decimal TotalInvestments { get; init; }
    public decimal Balance { get; init; }
    public IReadOnlyCollection<CategorySummaryDto> ByCategory { get; init; } = [];
    public IReadOnlyCollection<MonthlySummaryDto> ByMonth { get; init; } = [];
}

public sealed class CategorySummaryDto
{
    public string Category { get; init; } = string.Empty;
    public decimal TotalAmount { get; init; }
    public TransactionType Type { get; init; }
}

public sealed class MonthlySummaryDto
{
    public string Month { get; init; } = string.Empty;
    public decimal Income { get; init; }
    public decimal Expenses { get; init; }
    public decimal Investments { get; init; }
}
