using LoreForge.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LoreForge.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext()
        {
        }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Guide> Guides => Set<Guide>();
        public DbSet<GuideVersion> GuideVersions { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Rating> Ratings { get; set; }

        public DbSet<GuideVote> GuideVotes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed initial games into database
            modelBuilder.Entity<Game>().HasData(
                new Game { Id = 1, Title = "Elden Ring", Genre = "Action RPG / Dark Fantasy", CoverImageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" },
                new Game { Id = 2, Title = "Cyberpunk 2077", Genre = "Sci-Fi / Open World RPG", CoverImageUrl = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" },
                new Game { Id = 3, Title = "Valorant", Genre = "Tactical Hero FPS", CoverImageUrl = "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80" },
                new Game { Id = 4, Title = "Baldur's Gate 3", Genre = "CRPG / High Fantasy", CoverImageUrl = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80" },
                new Game { Id = 5, Title = "The Witcher 3", Genre = "Dark Fantasy RPG", CoverImageUrl = "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80" },
                new Game { Id = 6, Title = "Hollow Knight", Genre = "Metroidvania", CoverImageUrl = "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80" },
                new Game { Id = 7, Title = "Zelda: Tears of the Kingdom", Genre = "Action Adventure", CoverImageUrl = "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80" },
                new Game { Id = 8, Title = "God of War Ragnarök", Genre = "Mythological Action", CoverImageUrl = "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80" }
            );

            // Seed admin user
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "LoreForgeAdmin",
                    Email = "admin@loreforge.com",
                    PasswordHash = "$2a$11$9e2n.t8eFjF4zN2G1xK9u.k0q0v3Z5x7x8y9z0a1b2c3d4e5f6g7h8", // default placeholder
                    Role = "Admin"
                }
            );

            // Seed initial comprehensive guides
            modelBuilder.Entity<Guide>().HasData(
                new Guide
                {
                    Id = 1,
                    Title = "Elden Ring: Shadow of the Erdtree & Limgrave Secret Compendium",
                    Content = "Master the Tarnished journey with modular step checklists, hidden NPC quest triggers, Scadutree fragment routes, and optimized bleed/strength builds.\n\n## Walkthrough Steps\n\n### Step 1: Explore Limgrave & Unlock Gatefront Grace\nUpon emerging into the open Lands Between, sneak south past the Tree Sentinel patrol. Activate the First Step Site of Grace, speak with White Mask Varré, and follow the Golden Rays of Grace north towards the Gatefront Ruins.\n\n### Step 2: Form Accord with Melina & Summon Torrent\nRest at the Gatefront Ruins Grace site to meet Melina. Accept her accord to receive the Spectral Steed Whistle. Return to the Church of Elleh at nightfall to receive the Spirit Calling Bell and Lone Wolf Ashes from Ranni the Witch.\n\n### Step 3: Clear Weeping Peninsula & Flask Fortification\nHead south across the Bridge of Sacrifice. Collect 3 Sacred Tears at the Third Church of Marika and Callu Baptismal Church to upgrade flask potency. Defeat the Leonine Misbegotten at Castle Morne to secure the Grafted Blade Greatsword.\n\n### Step 4: Conquer Margit and Stormveil Gatekeeper\nEquip Margit's Shackle purchased from Patches in Murkwater Cave. When fighting Margit, use heavy jumping attacks to crack his posture, summon Sorcerer Rogier for spell support, and roll into his delayed overhead strikes.",
                    GameId = 1,
                    UserId = 1,
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
                    UserId = 1,
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
                    UserId = 1,
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
                    UserId = 1,
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
                    UserId = 1,
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
                    UserId = 1,
                    IsApproved = true,
                    Status = "Approved",
                    Upvotes = 67,
                    CreatedAt = new DateTime(2026, 3, 10, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Data Source=loreforge.db");
            }
        }
    }
}