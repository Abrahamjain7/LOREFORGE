using System;
using System.Collections.Generic;

namespace LoreForge.API.DTOs
{
    public class CreateGameDto
    {
        public string Title { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
    }

    public class CreateGuideDto
    {
        public int GameId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }

    public class UpdateGuideDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }

    public class GuideResponseDto
    {
        public long Id { get; set; }
        public string GameTitle { get; set; } = string.Empty;
        public string AuthorUsername { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int ViewCount { get; set; }
        public int Upvotes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}