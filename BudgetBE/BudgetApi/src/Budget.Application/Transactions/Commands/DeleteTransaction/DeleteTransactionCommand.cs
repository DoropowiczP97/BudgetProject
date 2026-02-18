using MediatR;

namespace Budget.Application.Transactions.Commands.DeleteTransaction;

public sealed class DeleteTransactionCommand : IRequest<Unit>
{
    public Guid Id { get; init; }
    public string UserId { get; set; } = string.Empty;

    public static DeleteTransactionCommand Create(Guid id, string userId)
    {
        return new DeleteTransactionCommand
        {
            Id = id,
            UserId = userId
        };
    }
}
