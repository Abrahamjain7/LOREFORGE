using LoreForge.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LoreForge.API.Data
{
    // AppDbContext inherits from EF Core's DbContext class
    public class AppDbContext : DbContext
    {
        // The constructor passes database configuration options to the base DbContext class
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSet properties represent tables in your PostgreSQL database.
        // EF Core will create tables named "Users" and "Games" based on these.
        public DbSet<User> Users { get; set; }
        public DbSet<Game> Games { get; set; }
    }
}