using Budget.Api.Common.Extensions;
using Budget.Application.Transactions.Commands.CreateTransaction;
using Budget.Application.Transactions.Commands.DeleteTransaction;
using Budget.Application.Transactions.Commands.UpdateTransaction;
using Budget.Application.Transactions.Queries.GetTransactions;
using Budget.Application.Transactions.Queries.GetTransactionsSummary;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budget.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class TransactionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public TransactionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetTransactions([FromQuery] GetTransactionsQuery query, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(query.WithUserId(User.GetUserId()), cancellationToken);
        return Ok(result);
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetTransactionsSummary([FromQuery] GetTransactionsSummaryQuery query, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(query.WithUserId(User.GetUserId()), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTransactionCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command.WithUserId(User.GetUserId()), cancellationToken);
        return CreatedAtAction(nameof(GetTransactions), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTransactionCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command.WithRouteIdAndUserId(id, User.GetUserId()), cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _mediator.Send(DeleteTransactionCommand.Create(id, User.GetUserId()), cancellationToken);
        return NoContent();
    }
}
