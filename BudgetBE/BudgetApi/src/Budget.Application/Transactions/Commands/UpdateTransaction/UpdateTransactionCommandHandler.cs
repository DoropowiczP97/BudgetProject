using AutoMapper;
using Budget.Application.Common.Exceptions;
using Budget.Application.Common.Interfaces;
using Budget.Application.Transactions.Common;
using Budget.Domain.Interfaces;
using MediatR;

namespace Budget.Application.Transactions.Commands.UpdateTransaction;

public sealed class UpdateTransactionCommandHandler : IRequestHandler<UpdateTransactionCommand, TransactionDto>
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public UpdateTransactionCommandHandler(
        ITransactionRepository transactionRepository,
        IApplicationDbContext applicationDbContext,
        IMapper mapper)
    {
        _transactionRepository = transactionRepository;
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }

    public async Task<TransactionDto> Handle(UpdateTransactionCommand request, CancellationToken cancellationToken)
    {
        var transaction = await _transactionRepository.GetByIdAsync(request.Id, request.UserId, cancellationToken);
        if (transaction is null)
        {
            throw new NotFoundException($"Transaction {request.Id} was not found.");
        }

        transaction.Update(
            request.Title,
            request.Amount,
            request.Currency,
            request.Type,
            request.Category,
            request.Description,
            request.Date);

        await _applicationDbContext.SaveChangesAsync(cancellationToken);

        return _mapper.Map<TransactionDto>(transaction);
    }
}
