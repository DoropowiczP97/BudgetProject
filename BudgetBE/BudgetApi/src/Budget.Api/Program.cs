using Budget.Api.Middleware;
using Budget.Application;
using Budget.Infrastructure;
using Budget.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var authority = builder.Configuration["Keycloak:Authority"];
        var audience = builder.Configuration["Keycloak:Audience"];
        var publicAuthority = builder.Configuration["Keycloak:PublicAuthority"];
        var frontendClientId = builder.Configuration["Keycloak:FrontendClientId"];

        options.Authority = authority;
        options.Audience = audience;
        options.RequireHttpsMetadata = false;
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidIssuers = string.IsNullOrWhiteSpace(publicAuthority) || string.Equals(publicAuthority, authority, StringComparison.OrdinalIgnoreCase)
                ? [authority!]
                : [authority!, publicAuthority],
        };
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                var audienceClaims = context.Principal?.FindAll("aud").Select(claim => claim.Value) ?? [];
                var hasApiAudience = !string.IsNullOrWhiteSpace(audience)
                    && audienceClaims.Contains(audience, StringComparer.OrdinalIgnoreCase);

                var azp = context.Principal?.FindFirst("azp")?.Value;
                var hasFrontendAzp = !string.IsNullOrWhiteSpace(frontendClientId)
                    && string.Equals(azp, frontendClientId, StringComparison.OrdinalIgnoreCase);

                if (!hasApiAudience && !hasFrontendAzp)
                {
                    context.Fail("Token does not contain expected audience or authorized party.");
                }

                return Task.CompletedTask;
            },
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [])
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
