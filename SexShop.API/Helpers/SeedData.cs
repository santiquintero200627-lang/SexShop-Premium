using Microsoft.AspNetCore.Identity;
using SexShop.Domain.Entities;
using SexShop.Domain.Entities.Identity;
using SexShop.Infrastructure.Persistence;

namespace SexShop.API.Helpers
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();

            // Seed Roles
            if (!await roleManager.RoleExistsAsync("Admin"))
                await roleManager.CreateAsync(new ApplicationRole { Name = "Admin", Description = "Administrator" });

            if (!await roleManager.RoleExistsAsync("Guest"))
                await roleManager.CreateAsync(new ApplicationRole { Name = "Guest", Description = "Client" });

            // Seed Admin User
            if (await userManager.FindByEmailAsync("admin@sexshop.com") == null)
            {
                var user = new ApplicationUser
                {
                    UserName = "admin@sexshop.com",
                    Email = "admin@sexshop.com",
                    FirstName = "Admin",
                    LastName = "System",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(user, "Admin123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "Admin");
                }
            }

            // Seed Products
            var productsToSeed = new List<Product>
            {
                new Product { Name = "Vibrador Clásico", Description = "Potente vibrador clásico de 7 velocidades.", Price = 125000m, Stock = 50, ImageUrl = "https://via.placeholder.com/400x300?text=Vibrador+Clasico", IsActive = true },
                new Product { Name = "Lencería Sexy Roja", Description = "Conjunto de lencería de encaje rojo.", Price = 85000m, Stock = 20, ImageUrl = "https://via.placeholder.com/400x300?text=Lenceria+Roja", IsActive = true },
                new Product { Name = "Aceite de Masaje", Description = "Aceite aromático para masajes relajantes.", Price = 45000m, Stock = 100, ImageUrl = "https://via.placeholder.com/400x300?text=Aceite+Masaje", IsActive = true },
                new Product { Name = "Vibrador Rabbit Deluxe", Description = "Vibrador con doble estimulación y material siliconado.", Price = 210000m, Stock = 15, ImageUrl = "https://via.placeholder.com/400x300?text=Rabbit+Deluxe", IsActive = true },
                new Product { Name = "Plug Anal Silicona Pro", Description = "Plug anal ergonómico de silicona médica.", Price = 65000m, Stock = 25, ImageUrl = "https://via.placeholder.com/400x300?text=Plug+Silicona", IsActive = true },
                new Product { Name = "Esposas Ajustables BDSM", Description = "Esposas acolchadas ajustables con cierre seguro.", Price = 55000m, Stock = 30, ImageUrl = "https://via.placeholder.com/400x300?text=Esposas+BDSM", IsActive = true },
                new Product { Name = "Lubricante Base Agua 250ml", Description = "Lubricante íntimo base agua, compatible con juguetes.", Price = 38000m, Stock = 40, ImageUrl = "https://via.placeholder.com/400x300?text=Lubricante", IsActive = true },
                new Product { Name = "Bala Vibradora Mini", Description = "Bala vibradora discreta con control remoto.", Price = 95000m, Stock = 20, ImageUrl = "https://via.placeholder.com/400x300?text=Bala+Vibradora", IsActive = true },
                new Product { Name = "Kit BDSM Principiantes", Description = "Kit completo con antifaz, esposas y látigo suave.", Price = 185000m, Stock = 10, ImageUrl = "https://via.placeholder.com/400x300?text=Kit+BDSM", IsActive = true },
                new Product { Name = "Anillo Vibrador Recargable", Description = "Anillo para parejas con vibración potente USB.", Price = 115000m, Stock = 18, ImageUrl = "https://via.placeholder.com/400x300?text=Anillo+Vibrador", IsActive = true },
                new Product { Name = "Masturbador Masculino Soft Touch", Description = "Masturbador con textura interna realista.", Price = 145000m, Stock = 22, ImageUrl = "https://via.placeholder.com/400x300?text=Masturbador", IsActive = true },
                new Product { Name = "Lencería Negra Transparente", Description = "Conjunto sensual de encaje negro.", Price = 92000m, Stock = 12, ImageUrl = "https://via.placeholder.com/400x300?text=Lenceria+Negra", IsActive = true },
                new Product { Name = "Gel Estimulante Femenino", Description = "Gel íntimo con efecto calor.", Price = 42000m, Stock = 35, ImageUrl = "https://via.placeholder.com/400x300?text=Gel+Estimulante", IsActive = true },
                new Product { Name = "Plug Anal Metálico Premium", Description = "Plug metálico de acero inoxidable brillante.", Price = 88000m, Stock = 14, ImageUrl = "https://via.placeholder.com/400x300?text=Plug+Metalico", IsActive = true },
                new Product { Name = "Vibrador Punto G Curvo", Description = "Vibrador diseñado para estimulación del punto G.", Price = 135000m, Stock = 16, ImageUrl = "https://via.placeholder.com/400x300?text=Vibrador+G", IsActive = true }
            };

            foreach (var product in productsToSeed)
            {
                if (!context.Products.Any(p => p.Name == product.Name))
                {
                    context.Products.Add(product);
                }
            }

            if (context.ChangeTracker.HasChanges())
            {
                await context.SaveChangesAsync();
            }
        }
    }
}
