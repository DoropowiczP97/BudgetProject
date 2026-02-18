using AutoMapper;
using Budget.Application.Common.Interfaces;
using Budget.Application.Transactions.Common;
using Budget.Domain.Entities;
using Budget.Domain.Interfaces;
using MediatR;

namespace Budget.Application.Transactions.Commands.CreateTransaction;

public sealed class CreateTransactionCommandHandler : IRequestHandler<CreateTransactionCommand, TransactionDto>
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public CreateTransactionCommandHandler(
        ITransactionRepository transactionRepository,
        IApplicationDbContext applicationDbContext,
        IMapper mapper)
    {
        _transactionRepository = transactionRepository;
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }

    public async Task<TransactionDto> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
    {
        var transaction = Transaction.Create(
            request.Title,
            request.Amount,
            request.Currency,
            request.Type,
            request.Category,
            request.Description,
            request.Date,
            request.UserId);

        await _transactionRepository.AddAsync(transaction, cancellationToken);
        await _applicationDbContext.SaveChangesAsync(cancellationToken);

        return _mapper.Map<TransactionDto>(transaction);
    }
}
