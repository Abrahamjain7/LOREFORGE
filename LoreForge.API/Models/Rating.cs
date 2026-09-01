using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoreForge.API.Models
{
    public class Rating
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long GuideId { get; set; }

        [ForeignKey("GuideId")]
        public Guide? Guide { get; set; }

        [Required]
        public long UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        // True for Upvote (+1), False for Downvote (-1)
        public bool IsUpvote { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}