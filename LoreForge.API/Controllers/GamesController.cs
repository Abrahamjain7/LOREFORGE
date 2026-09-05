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
    public class GamesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GamesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/games
        [HttpGet]
        public async Task<IActionResult> GetGames()
        {
            var games = await _context.Games.ToListAsync();
            return Ok(games);
        }

        // POST: api/games (Restricted to Admin only)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateGame([FromBody] CreateGameDto dto)
        {
            var game = new Game
            {
                Title = dto.Title,
                Genre = dto.Genre,
                CoverImageUrl = dto.CoverImageUrl
            };

            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            return Ok(game);
        }
    }
}
