using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoreForge.API.Models
{
    public class Guide
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public int GameId { get; set; }
        
        [ForeignKey("GameId")]
        public Game? Game { get; set; }

        [Required]
        public long AuthorId { get; set; }

        [ForeignKey("AuthorId")]
        public User? Author { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        [MaxLength(20)]
        // Status: "Pending", "Approved", "Rejected"
        public string Status { get; set; } = "Pending";

        public int ViewCount { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties for relationships
        public ICollection<GuideVersion> Versions { get; set; } = new List<GuideVersion>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    }
}