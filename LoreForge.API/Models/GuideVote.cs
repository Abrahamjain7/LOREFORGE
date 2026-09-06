namespace LoreForge.API.Models
{
    public class GuideVote
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }

        public int GuideId { get; set; }
        public Guide? Guide { get; set; }
    }
}