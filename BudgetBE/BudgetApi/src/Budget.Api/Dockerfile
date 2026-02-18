FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY BudgetApi.slnx ./
COPY src/Budget.Api/Budget.Api.csproj src/Budget.Api/
COPY src/Budget.Application/Budget.Application.csproj src/Budget.Application/
COPY src/Budget.Infrastructure/Budget.Infrastructure.csproj src/Budget.Infrastructure/
COPY src/Budget.Domain/Budget.Domain.csproj src/Budget.Domain/

RUN dotnet restore src/Budget.Api/Budget.Api.csproj

COPY src ./src
RUN dotnet publish src/Budget.Api/Budget.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./
EXPOSE 8080
ENTRYPOINT ["dotnet", "Budget.Api.dll"]
