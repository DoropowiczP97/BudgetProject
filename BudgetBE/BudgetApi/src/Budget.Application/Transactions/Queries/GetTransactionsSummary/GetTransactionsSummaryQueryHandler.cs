using Budget.Application.Common.Interfaces;
using Budget.Application.Transactions.Common;
using Budget.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budget.Application.Transactions.Queries.GetTransactionsSummary;

public sealed class GetTransactionsSummaryQueryHandler : IRequestHandler<GetTransactionsSummaryQuery, TransactionsSummaryDto>
{
    private readonly IApplicationDbContext _applicationDbContext;

    public GetTransactionsSummaryQueryHandler(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }

    public async Task<TransactionsSummaryDto> Handle(GetTransactionsSummaryQuery request, CancellationToken cancellationToken)
    {
        var query = _applicationDbContext.Transactions
            .AsNoTracking()
            .Where(transaction => transaction.UserId == request.UserId);

        if (request.DateFrom.HasValue)
        {
            query = query.Where(transaction => transaction.Date >= request.DateFrom.Value);
        }

        if (request.DateTo.HasValue)
        {
            query = query.Where(transaction => transaction.Date <= request.DateTo.Value);
        }

        var transactions = await query
            .Select(transaction => new
            {
                transaction.Type,
                transaction.Category,
                Amount = transaction.Money.Amount,
                transaction.Date
            })
            .ToListAsync(cancellationToken);

        var totalIncome = transactions
            .Where(transaction => transaction.Type == TransactionType.Income)
            .Sum(transaction => transaction.Amount);

        var totalExpenses = transactions
            .Where(transaction => transaction.Type == TransactionType.Expense)
            .Sum(transaction => transaction.Amount);

        var totalInvestments = transactions
            .Where(transaction => transaction.Type == TransactionType.Investment)
            .Sum(transaction => transaction.Amount);

        var byCategory = transactions
            .GroupBy(transaction => new { transaction.Category, transaction.Type })
            .Select(group => new CategorySummaryDto
            {
                Category = group.Key.Category,
                Type = group.Key.Type,
                TotalAmount = group.Sum(item => item.Amount)
            })
            .OrderBy(item => item.Type)
            .ThenByDescending(item => item.TotalAmount)
            .ToList();

        var byMonth = transactions
            .GroupBy(transaction => $"{transaction.Date.Year:D4}-{transaction.Date.Month:D2}")
            .Select(group => new MonthlySummaryDto
            {
                Month = group.Key,
                Income = group.Where(item => item.Type == TransactionType.Income).Sum(item => item.Amount),
                Expenses = group.Where(item => item.Type == TransactionType.Expense).Sum(item => item.Amount),
                Investments = group.Where(item => item.Type == TransactionType.Investment).Sum(item => item.Amount)
            })
            .OrderBy(item => item.Month)
            .ToList();

        return new TransactionsSummaryDto
        {
            TotalIncome = totalIncome,
            TotalExpenses = totalExpenses,
            TotalInvestments = totalInvestments,
            Balance = totalIncome - totalExpenses,
            ByCategory = byCategory,
            ByMonth = byMonth
        };
    }
}
