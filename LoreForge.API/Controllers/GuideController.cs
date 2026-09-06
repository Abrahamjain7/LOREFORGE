using System.Security.Claims;
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

        // GET: api/guides (Public - Approved guides only)
        [HttpGet]
        public async Task<IActionResult> GetApprovedGuides()
        {
            var guides = await _context.Guides
                .Include(g => g.Game)
                .Include(g => g.User)
                .Where(g => g.IsApproved)
                .Select(g => new GuideDto
                {
                    Id = g.Id,
                    Title = g.Title,
                    Content = g.Content,
                    IsApproved = g.IsApproved,
                    CreatedAt = g.CreatedAt,
                    Upvotes = g.Upvotes ?? 0,
                    GameId = g.GameId,
                    GameTitle = g.Game != null ? g.Game.Title : string.Empty,
                    AuthorEmail = g.User != null ? g.User.Email : string.Empty
                })
                .ToListAsync();

            return Ok(guides);
        }


        // GET: api/guides/{id} (Public)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGuideById(int id)
        {
            var guide = await _context.Guides
                .Include(g => g.Game)
                .Include(g => g.User)
                .Where(g => g.Id == id)
                .Select(g => new GuideDto
                {
                    Id = g.Id,
                    Title = g.Title,
                    Content = g.Content,
                    IsApproved = g.IsApproved,
                    CreatedAt = g.CreatedAt,
                    Upvotes = g.Upvotes ?? 0,
                    GameId = g.GameId,
                    GameTitle = g.Game != null ? g.Game.Title : string.Empty,
                    AuthorEmail = g.User != null ? g.User.Email : string.Empty
                })
                .FirstOrDefaultAsync();

            if (guide == null)
            {
                return NotFound("Guide not found.");
            }

            return Ok(guide);
        }





        // POST: api/guides (Requires Authentication)
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateGuide([FromBody] CreateGuideDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user identification in token.");
            }

            var gameExists = await _context.Games.AnyAsync(g => g.Id == dto.GameId);
            if (!gameExists)
            {
                return BadRequest("The specified game does not exist.");
            }

            var guide = new Guide
            {
                Title = dto.Title,
                Content = dto.Content,
                GameId = dto.GameId,
                UserId = userId,
                IsApproved = false,
                Upvotes = 0
            };

            _context.Guides.Add(guide);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Guide submitted successfully. Awaiting approval.", guideId = guide.Id });
        }

        // PUT: api/guides/{id}/approve (Admin Only)
        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveGuide(int id)
        {
            var guide = await _context.Guides.FindAsync(id);
            if (guide == null)
            {
                return NotFound("Guide not found.");
            }

            guide.IsApproved = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Guide {id} has been approved." });
        }

        // POST: api/guides/{id}/upvote (Requires Authentication)
        [HttpPost("{id}/upvote")]
        [Authorize]
        public async Task<IActionResult> UpvoteGuide(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user identification in token.");
            }

            var guide = await _context.Guides.FindAsync(id);
            if (guide == null)
            {
                return NotFound("Guide not found.");
            }

            // Check if user already upvoted
            var existingVote = await _context.GuideVotes
                .FirstOrDefaultAsync(v => v.GuideId == id && v.UserId == userId);

            if (existingVote != null)
            {
                // Toggle off: remove vote
                _context.GuideVotes.Remove(existingVote);
                guide.Upvotes = Math.Max(0, (guide.Upvotes ?? 0) - 1);
            }
            else
            {
                // Toggle on: add vote
                _context.GuideVotes.Add(new GuideVote { GuideId = id, UserId = userId });
                guide.Upvotes = (guide.Upvotes ?? 0) + 1;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = existingVote != null ? "Vote removed." : "Upvoted.", upvotes = guide.Upvotes });
        }
    }
}