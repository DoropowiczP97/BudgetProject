using Budget.Application.Common.Models;
using Budget.Application.Common.Interfaces;
using Budget.Application.Transactions.Common;
using Budget.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using MediatR;

namespace Budget.Application.Transactions.Queries.GetTransactions;

public sealed class GetTransactionsQueryHandler : IRequestHandler<GetTransactionsQuery, PaginatedList<TransactionDto>>
{
    private readonly IApplicationDbContext _applicationDbContext;

    public GetTransactionsQueryHandler(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }

    public async Task<PaginatedList<TransactionDto>> Handle(GetTransactionsQuery request, CancellationToken cancellationToken)
    {
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize <= 0 ? 10 : Math.Min(request.PageSize, 100);

        IQueryable<Transaction> query = _applicationDbContext.Transactions
            .AsNoTracking()
            .Where(transaction => transaction.UserId == request.UserId);

        if (request.Type.HasValue)
        {
            query = query.Where(transaction => transaction.Type == request.Type.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            var category = request.Category.Trim();
            query = query.Where(transaction => transaction.Category == category);
        }

        if (request.DateFrom.HasValue)
        {
            query = query.Where(transaction => transaction.Date >= request.DateFrom.Value);
        }

        if (request.DateTo.HasValue)
        {
            query = query.Where(transaction => transaction.Date <= request.DateTo.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.Trim().ToLower();
            query = query.Where(transaction =>
                transaction.Title.ToLower().Contains(searchTerm)
                || transaction.Category.ToLower().Contains(searchTerm)
                || (transaction.Description != null && transaction.Description.ToLower().Contains(searchTerm)));
        }

        query = (request.SortBy.Trim().ToLowerInvariant(), request.SortDesc) switch
        {
            ("title", true) => query.OrderByDescending(transaction => transaction.Title),
            ("title", false) => query.OrderBy(transaction => transaction.Title),
            ("amount", true) => query.OrderByDescending(transaction => transaction.Money.Amount),
            ("amount", false) => query.OrderBy(transaction => transaction.Money.Amount),
            ("category", true) => query.OrderByDescending(transaction => transaction.Category),
            ("category", false) => query.OrderBy(transaction => transaction.Category),
            ("type", true) => query.OrderByDescending(transaction => transaction.Type),
            ("type", false) => query.OrderBy(transaction => transaction.Type),
            ("createdat", true) => query.OrderByDescending(transaction => transaction.CreatedAt),
            ("createdat", false) => query.OrderBy(transaction => transaction.CreatedAt),
            ("date", true) => query.OrderByDescending(transaction => transaction.Date),
            ("date", false) => query.OrderBy(transaction => transaction.Date),
            (_, true) => query.OrderByDescending(transaction => transaction.Date),
            (_, false) => query.OrderBy(transaction => transaction.Date)
        };

        var projected = query.Select(transaction => new TransactionDto
        {
            Id = transaction.Id,
            Title = transaction.Title,
            Amount = transaction.Money.Amount,
            Currency = transaction.Money.Currency,
            Type = transaction.Type,
            Category = transaction.Category,
            Description = transaction.Description,
            Date = transaction.Date,
            CreatedAt = transaction.CreatedAt
        });

        return await PaginatedList<TransactionDto>.CreateAsync(projected, page, pageSize, cancellationToken);
    }
}
