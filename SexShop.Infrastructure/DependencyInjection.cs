using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using SexShop.Application.Interfaces;
using SexShop.Application.Settings;
using SexShop.Domain.Entities.Identity;
using SexShop.Infrastructure.Identity;
using SexShop.Infrastructure.Persistence;
using SexShop.Infrastructure.Repositories;
using System.Text;

namespace SexShop.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            if (configuration.GetValue<bool>("UsePostgres"))
            {
                var connectionString = configuration.GetConnectionString("PostgresConnection");
                
                if (string.IsNullOrEmpty(connectionString))
                {
                    Console.WriteLine("--> ERROR: PostgresConnection string is NULL or EMPTY");
                }
                else if (connectionString.StartsWith("postgres://") || connectionString.StartsWith("postgresql://"))
                {
                    try 
                    {
                        var uri = new Uri(connectionString);
                        var userInfo = uri.UserInfo.Split(':');
                        var username = Uri.UnescapeDataString(userInfo[0]);
                        var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
                        var host = uri.Host;
                        var port = uri.Port;
                        var database = Uri.UnescapeDataString(uri.AbsolutePath.TrimStart('/'));

                        connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true";
                        Console.WriteLine($"--> Postgres URI parsed successfully for host: {host}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"--> ERROR parsing Postgres URI: {ex.Message}");
                    }
                }
                else
                {
                    Console.WriteLine("--> Standard Postgres connection string detected.");
                    // Ensure SSL for production if it's not a URI but a standard string
                    if (!connectionString.Contains("SSL Mode", StringComparison.OrdinalIgnoreCase))
                    {
                        connectionString += ";SSL Mode=Require;Trust Server Certificate=true";
                    }
                }

                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseNpgsql(
                        connectionString,
                        b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));
            }
            else if (configuration.GetValue<bool>("UseSqlite"))
            {
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlite(
                        configuration.GetConnectionString("SqliteConnection"),
                        b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));
            }
            else
            {
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlServer(
                        configuration.GetConnectionString("DefaultConnection"),
                        b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));
            }

            // Identity
            services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
            {
                // Password settings (Relaxed for easier registration)
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 1; // Minimum length of 1
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.Password.RequiredUniqueChars = 0;
            })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            // UnitOfWork & Repository
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Auth Service
            services.AddScoped<IAuthService, AuthService>();

            // JWT Configuration
            services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(o =>
            {
                o.RequireHttpsMetadata = false;
                o.SaveToken = false;
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    ValidIssuer = configuration["JwtSettings:Issuer"],
                    ValidAudience = configuration["JwtSettings:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtSettings:Key"]!))
                };
            });

            return services;
        }
    }
}
