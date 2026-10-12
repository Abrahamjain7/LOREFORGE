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
                .Where(g => g.IsApproved || g.Status == "Approved")
                .OrderByDescending(g => g.CreatedAt)
                .Select(g => new GuideDto
                {
                    Id = g.Id,
                    Title = g.Title,
                    Content = g.Content,
                    IsApproved = g.IsApproved,
                    Status = g.Status,
                    CreatedAt = g.CreatedAt,
                    Upvotes = g.Upvotes ?? 0,
                    GameId = g.GameId,
                    GameTitle = g.Game != null ? g.Game.Title : string.Empty,
                    AuthorEmail = g.User != null ? g.User.Email : string.Empty,
                    AuthorId = g.UserId
                })
                .ToListAsync();

            return Ok(guides);
        }

        // GET: api/guides/all (Public / Admin - All guides including pending)
        [HttpGet("all")]
        public async Task<IActionResult> GetAllGuides()
        {
            var guides = await _context.Guides
                .Include(g => g.Game)
                .Include(g => g.User)
                .OrderByDescending(g => g.CreatedAt)
                .Select(g => new GuideDto
                {
                    Id = g.Id,
                    Title = g.Title,
                    Content = g.Content,
                    IsApproved = g.IsApproved,
                    Status = g.Status,
                    CreatedAt = g.CreatedAt,
                    Upvotes = g.Upvotes ?? 0,
                    GameId = g.GameId,
                    GameTitle = g.Game != null ? g.Game.Title : string.Empty,
                    AuthorEmail = g.User != null ? g.User.Email : string.Empty,
                    AuthorId = g.UserId
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
                .FirstOrDefaultAsync(g => g.Id == id);

            if (guide == null)
            {
                return NotFound("Guide not found.");
            }

            var comments = await _context.Comments
                .Include(c => c.User)
                .Where(c => c.GuideId == id)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new CommentDto
                {
                    Id = c.Id,
                    Text = c.Text,
                    CreatedAt = c.CreatedAt,
                    AuthorEmail = c.User != null ? c.User.Email : "Tarnished",
                    AuthorRole = c.User != null ? c.User.Role : "Reader"
                })
                .ToListAsync();

            var dto = new GuideDto
            {
                Id = guide.Id,
                Title = guide.Title,
                Content = guide.Content,
                IsApproved = guide.IsApproved,
                Status = guide.Status,
                CreatedAt = guide.CreatedAt,
                Upvotes = guide.Upvotes ?? 0,
                GameId = guide.GameId,
                GameTitle = guide.Game != null ? guide.Game.Title : string.Empty,
                AuthorEmail = guide.User != null ? guide.User.Email : string.Empty,
                AuthorId = guide.UserId,
                Comments = comments
            };

            return Ok(dto);
        }

        // POST: api/guides (Admin and Contributor only)
        [HttpPost]
        [Authorize(Roles = "Admin,Contributor")]
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

            var user = await _context.Users.FindAsync(userId);
            bool autoApprove = user != null && (user.Role == "Admin" || user.Role == "Contributor");

            var guide = new Guide
            {
                Title = dto.Title,
                Content = dto.Content,
                GameId = dto.GameId,
                UserId = userId,
                IsApproved = autoApprove,
                Status = autoApprove ? "Approved" : "Pending",
                Upvotes = 0
            };

            _context.Guides.Add(guide);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Guide published successfully!", guideId = guide.Id });
        }

        // PUT: api/guides/{id} (Contributor = own guides only; Admin = any guide)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Contributor")]
        public async Task<IActionResult> UpdateGuide(int id, [FromBody] UpdateGuideDto dto)
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

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (userRole != "Admin" && guide.UserId != userId)
            {
                return Forbid();
            }

            var gameExists = await _context.Games.AnyAsync(g => g.Id == dto.GameId);
            if (!gameExists)
            {
                return BadRequest("The specified game does not exist.");
            }

            guide.Title = dto.Title;
            guide.Content = dto.Content;
            guide.GameId = dto.GameId;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Guide updated successfully." });
        }

        // DELETE: api/guides/{id} (Contributor = own guides only; Admin = any guide)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Contributor")]
        public async Task<IActionResult> DeleteGuide(int id)
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

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (userRole != "Admin" && guide.UserId != userId)
            {
                return Forbid();
            }

            _context.Guides.Remove(guide);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Guide deleted successfully." });
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
            guide.Status = "Approved";
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Guide {id} has been approved." });
        }

        // POST: api/guides/{id}/comments (Requires Authentication)
        [HttpPost("{id}/comments")]
        [Authorize]
        public async Task<IActionResult> AddComment(int id, [FromBody] CreateCommentDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user identification in token.");
            }

            if (string.IsNullOrWhiteSpace(dto.Text))
            {
                return BadRequest("Comment text cannot be empty.");
            }

            var guideExists = await _context.Guides.AnyAsync(g => g.Id == id);
            if (!guideExists)
            {
                return NotFound("Guide not found.");
            }

            var comment = new Comment
            {
                GuideId = id,
                UserId = userId,
                Text = dto.Text,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);

            return Ok(new CommentDto
            {
                Id = comment.Id,
                Text = comment.Text,
                CreatedAt = comment.CreatedAt,
                AuthorEmail = user != null ? user.Email : "Tarnished",
                AuthorRole = user != null ? user.Role : "Reader"
            });
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