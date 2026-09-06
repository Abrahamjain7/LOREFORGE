namespace LoreForge.API.DTOs
{
    public class GameDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public string Platform { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
    }

    public class CreateGameDto
    {
        public string Title { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public string Platform { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
    }
}