using System.Text;
using LoreForge.API.Data;
using LoreForge.API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

// Clear default inbound claim mapping so standard JWT claim names remain unchanged
System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var builder = WebApplication.CreateBuilder(args);

// Connection String with Auto-detect DbProvider Fallback
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
bool isPostgresAvailable = false;

if (!string.IsNullOrWhiteSpace(connectionString))
{
    try
    {
        using var testConn = new Npgsql.NpgsqlConnection(connectionString + ";Timeout=2;CommandTimeout=2");
        testConn.Open();
        isPostgresAvailable = true;
    }
    catch
    {
        isPostgresAvailable = false;
    }
}

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (isPostgresAvailable)
    {
        options.UseNpgsql(connectionString);
    }
    else
    {
        options.UseSqlite("Data Source=loreforge.db");
    }
});

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            RoleClaimType = System.Security.Claims.ClaimTypes.Role
        };
    });

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger Configuration
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.OpenApiInfo { Title = "LoreForge.API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.SecuritySchemeType.ApiKey,
        In = Microsoft.OpenApi.ParameterLocation.Header,
        Description = "Enter 'Bearer ' followed by your token.\nExample: Bearer eyJhbGciOi..."
    });

    c.AddSecurityRequirement(document => new Microsoft.OpenApi.OpenApiSecurityRequirement
    {
        [new Microsoft.OpenApi.OpenApiSecuritySchemeReference("Bearer", document)] = new List<string>()
    });
});

// Configure CORS for React Client
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Ensure Database Created & Seed Admin Account on Startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        context.Database.EnsureCreated();

        // Check if abraham7@gmail.com exists; if so update password, otherwise create
        var adminUser = context.Users.FirstOrDefault(u => u.Email == "abraham7@gmail.com");
        var adminHash = BCrypt.Net.BCrypt.HashPassword("Admin@123");

        if (adminUser == null)
        {
            context.Users.Add(new User
            {
                Username = "AbrahamAdmin",
                Email = "abraham7@gmail.com",
                PasswordHash = adminHash,
                Role = "Admin"
            });
        }
        else
        {
            adminUser.PasswordHash = adminHash;
            adminUser.Role = "Admin";
        }

        // Also ensure admin@loreforge.com exists
        if (!context.Users.Any(u => u.Email == "admin@loreforge.com"))
        {
            context.Users.Add(new User
            {
                Username = "LoreForgeAdmin",
                Email = "admin@loreforge.com",
                PasswordHash = adminHash,
                Role = "Admin"
            });
        }
        context.SaveChanges();

        // Ensure all 8 core games exist in the database with their correct metadata
        var seedGames = new[]
        {
            new Game { Id = 1, Title = "Elden Ring", Genre = "Action RPG / Dark Fantasy", CoverImageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" },
            new Game { Id = 2, Title = "Cyberpunk 2077", Genre = "Sci-Fi / Open World RPG", CoverImageUrl = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" },
            new Game { Id = 3, Title = "Valorant", Genre = "Tactical Hero FPS", CoverImageUrl = "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80" },
            new Game { Id = 4, Title = "Baldur's Gate 3", Genre = "CRPG / High Fantasy", CoverImageUrl = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80" },
            new Game { Id = 5, Title = "The Witcher 3", Genre = "Dark Fantasy RPG", CoverImageUrl = "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80" },
            new Game { Id = 6, Title = "Hollow Knight", Genre = "Metroidvania", CoverImageUrl = "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80" },
            new Game { Id = 7, Title = "Zelda: Tears of the Kingdom", Genre = "Action Adventure", CoverImageUrl = "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80" },
            new Game { Id = 8, Title = "God of War Ragnarök", Genre = "Mythological Action", CoverImageUrl = "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80" }
        };

        foreach (var sg in seedGames)
        {
            var existingGame = context.Games.Find(sg.Id);
            if (existingGame == null)
            {
                context.Games.Add(sg);
            }
            else
            {
                existingGame.Title = sg.Title;
                existingGame.Genre = sg.Genre;
                existingGame.CoverImageUrl = sg.CoverImageUrl;
            }
        }
        context.SaveChanges();

        // Ensure official core strategy guides are seeded and approved
        var defaultAdmin = context.Users.FirstOrDefault(u => u.Email == "admin@loreforge.com") ?? context.Users.First();
        var seedGuides = new[]
        {
            new Guide
            {
                Id = 1,
                Title = "Elden Ring: Shadow of the Erdtree & Limgrave Secret Compendium",
                Content = "Master the Tarnished journey with modular step checklists, hidden NPC quest triggers, Scadutree fragment routes, and optimized bleed/strength builds.\n\n## Walkthrough Steps\n\n### Step 1: Explore Limgrave & Unlock Gatefront Grace\nUpon emerging into the open Lands Between, sneak south past the Tree Sentinel patrol. Activate the First Step Site of Grace, speak with White Mask Varré, and follow the Golden Rays of Grace north towards the Gatefront Ruins.\n\n### Step 2: Form Accord with Melina & Summon Torrent\nRest at the Gatefront Ruins Grace site to meet Melina. Accept her accord to receive the Spectral Steed Whistle. Return to the Church of Elleh at nightfall to receive the Spirit Calling Bell and Lone Wolf Ashes from Ranni the Witch.\n\n### Step 3: Clear Weeping Peninsula & Flask Fortification\nHead south across the Bridge of Sacrifice. Collect 3 Sacred Tears at the Third Church of Marika and Callu Baptismal Church to upgrade flask potency. Defeat the Leonine Misbegotten at Castle Morne to secure the Grafted Blade Greatsword.\n\n### Step 4: Conquer Margit and Stormveil Gatekeeper\nEquip Margit's Shackle purchased from Patches in Murkwater Cave. When fighting Margit, use heavy jumping attacks to crack his posture, summon Sorcerer Rogier for spell support, and roll into his delayed overhead strikes.",
                GameId = 1,
                UserId = defaultAdmin.Id,
                IsApproved = true,
                Status = "Approved",
                Upvotes = 78,
                CreatedAt = new DateTime(2026, 1, 15, 0, 0, 0, DateTimeKind.Utc)
            },
            new Guide
            {
                Id = 2,
                Title = "Cyberpunk 2077: Phantom Liberty Dogtown Netrunner & Sandy Matrix",
                Content = "Comprehensive breakdown of Tier 5++ Cyberware synergies, Overclock infinite RAM loops, and Relic combat exploits in the Pacifica black market.\n\n## Walkthrough Steps\n\n### Step 1: Procure the Militech Parline Cyberdeck\nLocate the black-market Ripperdoc in the Dogtown EBM Petrochem Stadium. Install the Militech Parline deck with Tier 5 Cyberware Malfunction and Synapse Burnout.\n\n### Step 2: Establish the Overclock RAM Generation Loop\nActivate Overclock to spend HP instead of RAM. Pair Blood Pump with Biomonitor cyberware to trigger auto-healing whenever your health drops below 50%.\n\n### Step 3: Hack Arasaka High-Threat Combat Units\nStack 3x Cyberware Malfunction followed by a single Synapse Burnout. This inflicts an automatic 300% critical damage multiplier and instant reboot on boss health bars.\n\n### Step 4: Unlock Relic Vulnerability Analytics\nInvest Relic points into Vulnerability Analytics to reveal neon vulnerability zones on Barghest armored mechs.",
                GameId = 2,
                UserId = defaultAdmin.Id,
                IsApproved = true,
                Status = "Approved",
                Upvotes = 64,
                CreatedAt = new DateTime(2026, 2, 10, 0, 0, 0, DateTimeKind.Utc)
            },
            new Guide
            {
                Id = 3,
                Title = "Valorant: Ascent & Lotus Tactical Dominance Protocols",
                Content = "Comprehensive initiator recon setups, post-plant crossfire geometry, and mid-split execution timings for competitive diamond to radiant ranks.\n\n## Walkthrough Steps\n\n### Step 1: Ascent A-Main Shock & Recon Lineup\nPosition at B-Lobby boundary. Align the Sova HUD charge diamond with the third rooftop antenna. Fire at 2-bar bounce to illuminate entire A-Rafters and Generator positions.\n\n### Step 2: Mid-Courtyard Smoke and Flash Choke\nDeploy Omen or Brimstone dark covers across Mid-Link and Mid-Bottom. Coordinate with an Initiator flash down Mid-Tiles to isolate market defenders.\n\n### Step 3: Post-Plant Defense & Defuse Denial\nPlace Brimstone incendiary or Killjoy Nanoswarms directly atop the spike casing. Retreat to A-Main with crossfire support from Wine.",
                GameId = 3,
                UserId = defaultAdmin.Id,
                IsApproved = true,
                Status = "Approved",
                Upvotes = 52,
                CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Guide
            {
                Id = 4,
                Title = "Baldur's Gate 3: Honour Mode Tactical Survival & Build Blueprint",
                Content = "Zero-death Honour Mode strategy guide: Open Hand Tavern Brawler Monk mechanics, Legendary Action boss counters, and Act 1-3 survival routes.\n\n## Walkthrough Steps\n\n### Step 1: Secure Hill Giant Strength Elixirs in the Underdark\nBefore confronting Auntie Ethel, purchase Hill Giant Elixirs from Auntie Ethel and Derryth Bonecloak in the Underdark Myconid Colony to lock your Strength at 21.\n\n### Step 2: Speccing Open Hand Tavern Brawler\nAt Level 4, take Tavern Brawler feat. Combine with Flurry of Blows: Topple to knock tough enemies prone without saving throws, allowing 100% advantage.\n\n### Step 3: Counter Grym's Legendary Action in the Adamantine Forge\nLure Grym onto the central forge anvil using minor illusion or spiritual weapon. Drop the forge hammer twice while remaining elevated on the scaffolding.\n\n### Step 4: House of Hope & Raphael Disruption\nCast Globe of Invulnerability to shield your squad from Raphael's Hellfire Soul Pillar explosions. Use Hold Monster with high DC spellcasting to lock Raphael down.",
                GameId = 4,
                UserId = defaultAdmin.Id,
                IsApproved = true,
                Status = "Approved",
                Upvotes = 91,
                CreatedAt = new DateTime(2026, 3, 5, 0, 0, 0, DateTimeKind.Utc)
            },
            new Guide
            {
                Id = 5,
                Title = "The Witcher 3: Death March Euphoria Alchemy & Grandmaster Witcher Gear",
                Content = "The definitive Death March build guide: Euphoria mutagen toxicity stacking, Aerondight damage scaling, and Grandmaster Ursine/Griffin gear locations.\n\n## Walkthrough Steps\n\n### Step 1: Unlock Toussaint Mutations & Euphoria\nComplete the 'Turn and Face the Strange' quest in the Beauclair cemetery laboratory to unlock the Euphoria mutation. Each point of toxicity grants +0.75% sword and sign damage.\n\n### Step 2: Craft Superior Decoctions and Oils\nSynthesize Ekimmara, Troll, and Water Hag decoctions. Using Acquired Tolerance and Heightened Tolerance perks allows running at 280+ maximum toxicity without decay.\n\n### Step 3: Acquire Aerondight Silver Sword\nDemonstrate the five chivalric virtues in Toussaint (Compassion, Generosity, Honor, Valor, Wisdom) to claim Aerondight from the Hermit at Lac Célavy.\n\n### Step 4: Grandmaster Ursine Quen Fortress\nForge the Grandmaster Ursine set in Beauclair. The full set bonus gives a 30% chance that when a Quen shield breaks, a new one is cast instantly at zero stamina cost.",
                GameId = 5,
                UserId = defaultAdmin.Id,
                IsApproved = true,
                Status = "Approved",
                Upvotes = 85,
                CreatedAt = new DateTime(2026, 3, 8, 0, 0, 0, DateTimeKind.Utc)
            },
            new Guide
            {
                Id = 6,
                Title = "Hollow Knight: Pantheon of Hallownest & Charm Synergies",
                Content = "Flawless boss rush breakdown for the Pantheon of Hallownest: charm builds for Nail and Spell masters, Radiant boss counters, and bindings strategies.\n\n## Walkthrough Steps\n\n### Step 1: Core Pantheon Charm Loadout\nEquip Unbreakable Strength, Shaman Stone, Quick Slash, and Longnail. This combines high melee DPS with devastating Shade Soul and Descending Dark burst.\n\n### Step 2: Master Descending Dark Invincibility Frames\nAbuse the 0.4-second full invulnerability window of Descending Dark whenever bosses like Pure Vessel or Nightmare King Grimm trigger wide area-of-effect sweeps.\n\n### Step 3: Pure Vessel Parry & Stagger Cadence\nShadow dash through his triple slash attack, nail bounce on his sword lunge, and punish the soul dagger burst with Abyss Shriek from below.\n\n### Step 4: Absolute Radiance Ascendancy & Climb\nDuring the platform phase, stay on the bottom-center platform and let Radiance teleport to you. In the final ascent, jump slightly away before shadow dashing up.",
                GameId = 6,
                UserId = defaultAdmin.Id,
                IsApproved = true,
                Status = "Approved",
                Upvotes = 67,
                CreatedAt = new DateTime(2026, 3, 10, 0, 0, 0, DateTimeKind.Utc)
            }
        };

        foreach (var sg in seedGuides)
        {
            var existingGuide = context.Guides.Find(sg.Id);
            if (existingGuide == null)
            {
                context.Guides.Add(sg);
            }
            else
            {
                existingGuide.Title = sg.Title;
                existingGuide.Content = sg.Content;
                existingGuide.GameId = sg.GameId;
                existingGuide.IsApproved = true;
                existingGuide.Status = "Approved";
                existingGuide.Upvotes = sg.Upvotes;
            }
        }
        context.SaveChanges();

        if (isPostgresAvailable)
        {
            try
            {
                context.Database.ExecuteSqlRaw(@"
                    SELECT setval(pg_get_serial_sequence('""Guides""', 'Id'), COALESCE(MAX(""Id""), 1)) FROM ""Guides"";
                    SELECT setval(pg_get_serial_sequence('""Games""', 'Id'), COALESCE(MAX(""Id""), 1)) FROM ""Games"";
                    SELECT setval(pg_get_serial_sequence('""Users""', 'Id'), COALESCE(MAX(""Id""), 1)) FROM ""Users"";
                ");
            }
            catch (Exception seqEx)
            {
                Console.WriteLine($"[Sequence Sync Note]: {seqEx.Message}");
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Database Seeder Note]: {ex.Message}");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReact");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();