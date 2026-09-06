using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoreForge.API.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Ensure foreign key matches Guide.Id (int)
        public int GuideId { get; set; }
        public Guide? Guide { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }
    }
}