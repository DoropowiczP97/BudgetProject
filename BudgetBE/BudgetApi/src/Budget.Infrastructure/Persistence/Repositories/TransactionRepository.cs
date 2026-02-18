using Budget.Domain.Entities;
using Budget.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Budget.Infrastructure.Persistence.Repositories;

public sealed class TransactionRepository : ITransactionRepository
{
    private readonly ApplicationDbContext _applicationDbContext;

    public TransactionRepository(ApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }

    public async Task AddAsync(Transaction transaction, CancellationToken cancellationToken)
    {
        await _applicationDbContext.Transactions.AddAsync(transaction, cancellationToken);
    }

    public Task<Transaction?> GetByIdAsync(Guid id, string userId, CancellationToken cancellationToken)
    {
        return _applicationDbContext.Transactions.FirstOrDefaultAsync(
            transaction => transaction.Id == id && transaction.UserId == userId,
            cancellationToken);
    }

    public void Remove(Transaction transaction)
    {
        _applicationDbContext.Transactions.Remove(transaction);
    }
}
