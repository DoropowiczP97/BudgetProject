using AutoMapper;
using Budget.Application.Transactions.Common;
using Budget.Domain.Entities;

namespace Budget.Application.Common.Mappings;

public sealed class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Transaction, TransactionDto>()
            .ForMember(destination => destination.Amount, expression => expression.MapFrom(source => source.Money.Amount))
            .ForMember(destination => destination.Currency, expression => expression.MapFrom(source => source.Money.Currency));
    }
}
