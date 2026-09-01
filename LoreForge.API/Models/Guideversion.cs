using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoreForge.API.Models
{
    public class GuideVersion
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long GuideId { get; set; }

        [ForeignKey("GuideId")]
        public Guide? Guide { get; set; }

        [Required]
        public long EditedById { get; set; }

        [ForeignKey("EditedById")]
        public User? EditedBy { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    }
}