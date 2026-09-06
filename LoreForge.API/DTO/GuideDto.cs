namespace LoreForge.API.DTOs
{
    public class GuideDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsApproved { get; set; }
        public DateTime CreatedAt { get; set; }
        public int Upvotes { get; set; }
        public int GameId { get; set; }
        public string GameTitle { get; set; } = string.Empty;
        public string AuthorEmail { get; set; } = string.Empty;
    }

    public class CreateGuideDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int GameId { get; set; }
    }
}