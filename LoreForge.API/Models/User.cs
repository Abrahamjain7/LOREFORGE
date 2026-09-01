using System;
using System.ComponentModel.DataAnnotations;

namespace LoreForge.API.Models
{
    public class User
    {
        [Key] // Marks this as the Primary Key
        public long Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        // Will store roles: Admin, Contributor, Reader
        public string Role { get; set; } = "Reader"; 

        public int ReputationPoints { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}