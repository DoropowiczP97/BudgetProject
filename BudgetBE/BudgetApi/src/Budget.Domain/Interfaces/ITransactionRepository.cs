using Budget.Domain.Entities;

namespace Budget.Domain.Interfaces;

public interface ITransactionRepository
{
    Task AddAsync(Transaction transaction, CancellationToken cancellationToken);
    Task<Transaction?> GetByIdAsync(Guid id, string userId, CancellationToken cancellationToken);
    void Remove(Transaction transaction);
}
