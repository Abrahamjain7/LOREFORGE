using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoreForge.API.Models
{
    public class Rating
    {
        public int Id { get; set; }
        public int Score { get; set; }

        public int GuideId { get; set; }
        public Guide? Guide { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }
    }
}