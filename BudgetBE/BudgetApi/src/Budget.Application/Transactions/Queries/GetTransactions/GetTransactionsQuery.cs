using Budget.Application.Common.Models;
using Budget.Application.Transactions.Common;
using Budget.Domain.Enums;
using MediatR;

namespace Budget.Application.Transactions.Queries.GetTransactions;

public sealed class GetTransactionsQuery : IRequest<PaginatedList<TransactionDto>>
{
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 10;
    public TransactionType? Type { get; init; }
    public string? Category { get; init; }
    public DateOnly? DateFrom { get; init; }
    public DateOnly? DateTo { get; init; }
    public string? SearchTerm { get; init; }
    public string SortBy { get; init; } = "date";
    public bool SortDesc { get; init; } = true;
    public string UserId { get; set; } = string.Empty;

    public GetTransactionsQuery WithUserId(string userId)
    {
        return new GetTransactionsQuery
        {
            Page = Page,
            PageSize = PageSize,
            Type = Type,
            Category = Category,
            DateFrom = DateFrom,
            DateTo = DateTo,
            SearchTerm = SearchTerm,
            SortBy = SortBy,
            SortDesc = SortDesc,
            UserId = userId
        };
    }
}
