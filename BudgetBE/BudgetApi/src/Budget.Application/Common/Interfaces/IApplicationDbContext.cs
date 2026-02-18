using Budget.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Budget.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Transaction> Transactions { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
