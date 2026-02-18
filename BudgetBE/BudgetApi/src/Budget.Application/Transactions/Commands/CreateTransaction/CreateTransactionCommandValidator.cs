using FluentValidation;

namespace Budget.Application.Transactions.Commands.CreateTransaction;

public sealed class CreateTransactionCommandValidator : AbstractValidator<CreateTransactionCommand>
{
    public CreateTransactionCommandValidator()
    {
        RuleFor(command => command.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(command => command.Amount)
            .GreaterThan(0);

        RuleFor(command => command.Currency)
            .NotEmpty()
            .MaximumLength(3);

        RuleFor(command => command.Category)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(command => command.Date)
            .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.UtcNow));
    }
}
