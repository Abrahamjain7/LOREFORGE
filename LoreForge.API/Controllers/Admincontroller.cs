using System.Threading.Tasks;
using LoreForge.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LoreForge.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/pending-guides
        [HttpGet("pending-guides")]
        public async Task<IActionResult> GetPendingGuides()
        {
            var pendingGuides = await _context.Guides
                .Include(g => g.Game)
                .Include(g => g.Author)
                .Where(g => g.Status == "Pending")
                .ToListAsync();

            return Ok(pendingGuides);
        }

        // POST: api/admin/approve-guide/{id}
        [HttpPost("approve-guide/{id}")]
        public async Task<IActionResult> ApproveGuide(long id)
        {
            var guide = await _context.Guides.FindAsync(id);
            if (guide == null) return NotFound("Guide not found.");

            guide.Status = "Approved";
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Guide approved and published!" });
        }

        // POST: api/admin/reject-guide/{id}
        [HttpPost("reject-guide/{id}")]
        public async Task<IActionResult> RejectGuide(long id)
        {
            var guide = await _context.Guides.FindAsync(id);
            if (guide == null) return NotFound("Guide not found.");

            guide.Status = "Rejected";
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Guide rejected." });
        }
    }
}