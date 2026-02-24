# Dockerfile for SexShop.Web

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["SexShop.Web/SexShop.Web.csproj", "SexShop.Web/"]
COPY ["SexShop.Application/SexShop.Application.csproj", "SexShop.Application/"]
COPY ["SexShop.Domain/SexShop.Domain.csproj", "SexShop.Domain/"]
# Web might not directly depend on Infrastructure, but let's check
COPY ["SexShop.Infrastructure/SexShop.Infrastructure.csproj", "SexShop.Infrastructure/"]
RUN dotnet restore "./SexShop.Web/SexShop.Web.csproj"
COPY . .
WORKDIR "/src/SexShop.Web"
RUN dotnet build "./SexShop.Web.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./SexShop.Web.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SexShop.Web.dll"]
