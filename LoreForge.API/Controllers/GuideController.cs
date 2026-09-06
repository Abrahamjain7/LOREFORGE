using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using LoreForge.API.Data;
using LoreForge.API.DTOs;
using LoreForge.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LoreForge.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GuidesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GuidesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/guides (Only approved guides for readers)
        [HttpGet]
        public async Task<IActionResult> GetApprovedGuides([FromQuery] string? search, [FromQuery] int? gameId)
        {
            var query = _context.Guides
                .Include(g => g.Game)
                .Include(g => g.Author)
                .Include(g => g.Ratings)
                .Where(g => g.Status == "Approved")
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(g => g.Title.ToLower().Contains(search.ToLower()) || g.Content.ToLower().Contains(search.ToLower()));
            }

            if (gameId.HasValue)
            {
                query = query.Where(g => g.GameId == gameId.Value);
            }

            var guides = await query.Select(g => new GuideResponseDto
            {
                Id = g.Id,
                GameTitle = g.Game != null ? g.Game.Title : "Unknown",
                AuthorUsername = g.Author != null ? g.Author.Username : "Anonymous",
                Title = g.Title,
                Content = g.Content,
                Status = g.Status,
                ViewCount = g.ViewCount,
                Upvotes = g.Ratings.Count(r => r.IsUpvote),
                CreatedAt = g.CreatedAt
            }).ToListAsync();

            return Ok(guides);
        }

        // POST: api/guides (Contributors & Admins can submit guides)
        [HttpPost]
        [Authorize(Roles = "Contributor,Admin")]
        public async Task<IActionResult> CreateGuide([FromBody] CreateGuideDto dto)
        {
            var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var guide = new Guide
            {
                GameId = dto.GameId,
                AuthorId = userId,
                Title = dto.Title,
                Content = dto.Content,
                Status = "Pending" // Sent to moderation queue
            };

            _context.Guides.Add(guide);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Guide submitted successfully and is pending admin approval.", GuideId = guide.Id });
        }

        // PUT: api/guides/{id} (Updates content & records version history)
        [HttpPut("{id}")]
        [Authorize(Roles = "Contributor,Admin")]
        public async Task<IActionResult> UpdateGuide(long id, [FromBody] UpdateGuideDto dto)
        {
            var guide = await _context.Guides.FindAsync(id);
            if (guide == null) return NotFound("Guide not found.");

            var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // Record edit history before updating current content
            var version = new GuideVersion
            {
                GuideId = guide.Id,
                EditedById = userId,
                Content = guide.Content,
                ChangedAt = DateTime.UtcNow
            };
            _context.GuideVersions.Add(version);

            // Update guide
            guide.Title = dto.Title;
            guide.Content = dto.Content;
            guide.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Guide updated successfully and previous version saved." });
        }

        // POST: api/guides/{id}/upvote
        [HttpPost("{id}/upvote")]
        [Authorize]
        public async Task<IActionResult> UpvoteGuide(long id)
        {
            var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var existingRating = await _context.Ratings.FirstOrDefaultAsync(r => r.GuideId == id && r.UserId == userId);
            if (existingRating != null)
            {
                return BadRequest("You have already voted on this guide.");
            }

            var rating = new Rating
            {
                GuideId = id,
                UserId = userId,
                IsUpvote = true
            };

            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Upvote registered." });
        }
    }
}