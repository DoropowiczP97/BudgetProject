using Budget.Application.Common.Exceptions;
using Budget.Application.Common.Interfaces;
using Budget.Domain.Interfaces;
using MediatR;

namespace Budget.Application.Transactions.Commands.DeleteTransaction;

public sealed class DeleteTransactionCommandHandler : IRequestHandler<DeleteTransactionCommand, Unit>
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IApplicationDbContext _applicationDbContext;

    public DeleteTransactionCommandHandler(
        ITransactionRepository transactionRepository,
        IApplicationDbContext applicationDbContext)
    {
        _transactionRepository = transactionRepository;
        _applicationDbContext = applicationDbContext;
    }

    public async Task<Unit> Handle(DeleteTransactionCommand request, CancellationToken cancellationToken)
    {
        var transaction = await _transactionRepository.GetByIdAsync(request.Id, request.UserId, cancellationToken);
        if (transaction is null)
        {
            throw new NotFoundException($"Transaction {request.Id} was not found.");
        }

        _transactionRepository.Remove(transaction);
        await _applicationDbContext.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
