using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoreForge.API.Models
{
    public class Guide
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
        public bool IsApproved { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? Upvotes { get; set; } = 0;

        // Foreign Keys & Navigation Properties
        public int GameId { get; set; }
        public Game? Game { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        // Ignore in EF Core database mapping
        [NotMapped]
        public User? Author 
        { 
            get => User; 
            set => User = value; 
        }
    }
}