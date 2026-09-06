using System;
using System.ComponentModel.DataAnnotations;

using System.Collections.Generic;

namespace LoreForge.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "User";

        // Navigation properties
        public ICollection<Guide> Guides { get; set; } = new List<Guide>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    }
}