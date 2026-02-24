using SexShop.Application;
using SexShop.Infrastructure;
using SexShop.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS Policy Profesional
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowWeb",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

// app.UseHttpsRedirection();

app.UseRouting();

// Activar CORS
app.UseCors("AllowWeb");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed Data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        
        // SQLite handle: EnsureCreated is safer than Migrate for quick DB switches
        if (app.Configuration.GetValue<bool>("UseSqlite"))
        {
            await context.Database.EnsureCreatedAsync();
        }
        else 
        {
            await context.Database.MigrateAsync();
        }

        await SexShop.API.Helpers.SeedData.Initialize(services);
        Console.WriteLine("--> Database Seeded Successfully");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred seeding the DB.");
        Console.WriteLine($"--> DB Error: {ex.Message}");
    }
}

app.Run();
