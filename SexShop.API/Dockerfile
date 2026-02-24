# Dockerfile for SexShop.API

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["SexShop.API/SexShop.API.csproj", "SexShop.API/"]
COPY ["SexShop.Application/SexShop.Application.csproj", "SexShop.Application/"]
COPY ["SexShop.Domain/SexShop.Domain.csproj", "SexShop.Domain/"]
COPY ["SexShop.Infrastructure/SexShop.Infrastructure.csproj", "SexShop.Infrastructure/"]
RUN dotnet restore "./SexShop.API/SexShop.API.csproj"
COPY . .
WORKDIR "/src/SexShop.API"
RUN dotnet build "./SexShop.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./SexShop.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
# Ensure the data directory exists for SQLite
RUN mkdir -p /app/data
ENV ConnectionStrings__SqliteConnection="Data Source=/app/data/SexShop.db"
ENTRYPOINT ["dotnet", "SexShop.API.dll"]
