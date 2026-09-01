using System.ComponentModel.DataAnnotations;

namespace LoreForge.API.Models
{
    public class Game
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Genre { get; set; } = string.Empty;

        [MaxLength(255)]
        public string CoverImageUrl { get; set; } = string.Empty;
    }
}