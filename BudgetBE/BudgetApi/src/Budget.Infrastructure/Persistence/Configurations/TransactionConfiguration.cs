using Budget.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budget.Infrastructure.Persistence.Configurations;

public sealed class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.ToTable("transactions");

        builder.HasKey(transaction => transaction.Id);

        builder.Property(transaction => transaction.Id)
            .ValueGeneratedNever();

        builder.Property(transaction => transaction.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(transaction => transaction.Category)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(transaction => transaction.Description)
            .HasMaxLength(1000);

        builder.Property(transaction => transaction.Type)
            .IsRequired();

        builder.Property(transaction => transaction.Date)
            .IsRequired();

        builder.Property(transaction => transaction.CreatedAt)
            .IsRequired();

        builder.Property(transaction => transaction.UpdatedAt);

        builder.Property(transaction => transaction.UserId)
            .IsRequired()
            .HasMaxLength(100);

        builder.OwnsOne(transaction => transaction.Money, ownedBuilder =>
        {
            ownedBuilder.Property(valueObject => valueObject.Amount)
                .HasColumnName("amount")
                .HasPrecision(18, 2)
                .IsRequired();

            ownedBuilder.Property(valueObject => valueObject.Currency)
                .HasColumnName("currency")
                .HasMaxLength(3)
                .IsRequired();
        });

        builder.HasIndex(transaction => transaction.UserId);
        builder.HasIndex(transaction => new { transaction.UserId, transaction.Date });
        builder.HasIndex(transaction => new { transaction.UserId, transaction.Type });
    }
}
