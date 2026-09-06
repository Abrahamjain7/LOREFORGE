using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoreForge.API.Models
{
    public class GuideVersion
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public int VersionNumber { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Key matching Guide.Id (int)
        public int GuideId { get; set; }
        public Guide? Guide { get; set; }
    }
}