namespace LoreForge.API.DTOs
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string AuthorEmail { get; set; } = string.Empty;
        public string AuthorRole { get; set; } = string.Empty;
    }

    public class CreateCommentDto
    {
        public string Text { get; set; } = string.Empty;
    }

    public class GuideDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsApproved { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; }
        public int Upvotes { get; set; }
        public int GameId { get; set; }
        public string GameTitle { get; set; } = string.Empty;
        public string AuthorEmail { get; set; } = string.Empty;
        public int AuthorId { get; set; }
        public List<CommentDto> Comments { get; set; } = new List<CommentDto>();
    }

    public class CreateGuideDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int GameId { get; set; }
    }

    public class UpdateGuideDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int GameId { get; set; }
    }
}