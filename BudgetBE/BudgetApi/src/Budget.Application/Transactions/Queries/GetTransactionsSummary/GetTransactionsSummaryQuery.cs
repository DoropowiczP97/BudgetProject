using Budget.Application.Transactions.Common;
using MediatR;

namespace Budget.Application.Transactions.Queries.GetTransactionsSummary;

public sealed class GetTransactionsSummaryQuery : IRequest<TransactionsSummaryDto>
{
    public DateOnly? DateFrom { get; init; }
    public DateOnly? DateTo { get; init; }
    public string UserId { get; set; } = string.Empty;

    public GetTransactionsSummaryQuery WithUserId(string userId)
    {
        return new GetTransactionsSummaryQuery
        {
            DateFrom = DateFrom,
            DateTo = DateTo,
            UserId = userId
        };
    }
}
