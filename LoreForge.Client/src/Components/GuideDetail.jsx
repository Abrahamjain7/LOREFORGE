import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios.js';

// Dynamic Gaming Theme Presets
const GAME_THEMES = {
  'Elden Ring': {
    pageBg: 'bg-[#030302] selection:bg-amber-500/30 selection:text-amber-200',
    ambientGlow: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/15 via-[#030302] to-[#010101]',
    cardBorder: 'border-amber-500/20 shadow-2xl shadow-black/80',
    accentColor: 'border-amber-500/30 text-amber-300/90 bg-amber-950/20',
    bannerImg: 'https://cdn11.bigcommerce.com/s-k0hjo2yyrq/images/stencil/1280x1280/products/1103/4304/Elden_Ring_Standard_Edition_Product_Banner__17279.1689241070.jpg?c=1g',
    badgeText: '✨ ELDEN RING',
    icon: '🗡️',
    statLabel1: 'Recommended Level',
    statValue1: 'RL 1 - 35',
    statLabel2: 'Starting Region',
    statValue2: 'Limgrave & Weeping Peninsula',
    goldGlow: 'shadow-[0_0_40px_rgba(217,119,6,0.08)]',
  },
  'Cyberpunk 2077': {
    pageBg: 'bg-[#030712] selection:bg-cyan-500/30 selection:text-cyan-200',
    ambientGlow: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/30 via-[#030712] to-[#010206]',
    cardBorder: 'border-cyan-500/20 shadow-2xl shadow-black/80',
    accentColor: 'border-cyan-500/30 text-cyan-300/90 bg-cyan-950/20',
    bannerImg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    badgeText: '⚡ CYBERPUNK 2077',
    icon: '🤖',
    statLabel1: 'Operating System',
    statValue1: 'Cyberdeck Mk.3',
    statLabel2: 'District',
    statValue2: 'Night City',
    goldGlow: 'shadow-[0_0_40px_rgba(6,182,212,0.08)]',
  },
  'Valorant': {
    pageBg: 'bg-[#060911] selection:bg-rose-500/30 selection:text-rose-200',
    ambientGlow: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/30 via-[#060911] to-[#030408]',
    cardBorder: 'border-rose-500/20 shadow-2xl shadow-black/80',
    accentColor: 'border-rose-500/30 text-rose-300/90 bg-rose-950/20',
    bannerImg: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
    badgeText: '🎯 VALORANT',
    icon: '💥',
    statLabel1: 'Recommended Role',
    statValue1: 'Duelist / Initiator',
    statLabel2: 'Map Focus',
    statValue2: 'Ascent / Bind',
    goldGlow: 'shadow-[0_0_40px_rgba(244,63,94,0.08)]',
  },
  'General': {
    pageBg: 'bg-slate-950 selection:bg-blue-500/30 selection:text-blue-200',
    ambientGlow: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/20 via-slate-950 to-slate-950',
    cardBorder: 'border-slate-800/80 shadow-2xl shadow-black/80',
    accentColor: 'border-blue-500/30 text-blue-300/90 bg-slate-900/50',
    bannerImg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    badgeText: '🎮 STRATEGY GUIDE',
    icon: '📖',
    statLabel1: 'Difficulty',
    statValue1: 'Intermediate',
    statLabel2: 'Category',
    statValue2: 'Community Guide',
    goldGlow: '',
  }
};

export default function GuideDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  // Interactive Modular Guide State
  const [objectives, setObjectives] = useState([
    { id: 1, text: 'Reach Church of Elleh & get Crafting Kit', completed: false },
    { id: 2, text: 'Meet Melina at Gatefront Ruins', completed: false },
    { id: 3, text: 'Unlock Torrent (Spectral Steed Whistle)', completed: false },
    { id: 4, text: 'Receive Spirit Calling Bell at night', completed: false },
    { id: 5, text: 'Collect Golden Seeds & Sacred Tears', completed: false },
    { id: 6, text: 'Defeat Margit, the Fell Omen', completed: false },
  ]);

  const [revealedSecrets, setRevealedSecrets] = useState({});
  const [openFaq, setOpenFaq] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    API.get(`/guides/${id}`)
      .then((res) => {
        setGuide(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching guide detail:', err);
        setError('Failed to fetch guide details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#030302] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mb-4"></div>
        <p className="text-amber-400/80 font-serif tracking-[0.2em] text-xs uppercase animate-pulse">
          TOUCHING SITE OF GRACE...
        </p>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="fixed inset-0 z-50 bg-[#030302] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-950 border border-red-900/60 p-8 rounded-xl text-center shadow-2xl">
          <p className="text-red-400 font-medium mb-6">{error || 'Guide not found.'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-slate-900 text-slate-200 px-5 py-2.5 rounded-lg text-sm border border-slate-700 hover:border-amber-500 hover:text-amber-300 transition duration-300"
          >
            ← Return to Hub
          </button>
        </div>
      </div>
    );
  }

  const theme = GAME_THEMES[guide.gameTitle] || GAME_THEMES['General'];
  const isEldenRing = guide.gameTitle === 'Elden Ring';

  const toggleObjective = (index) => {
    const updated = [...objectives];
    updated[index].completed = !updated[index].completed;
    setObjectives(updated);
  };

  const completedCount = objectives.filter(o => o.completed).length;
  const progressPercent = Math.round((completedCount / objectives.length) * 100);

  const toggleSecret = (key) => {
    setRevealedSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFaqAccordion = (index) => {
    setOpenFaq(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${theme.pageBg} ${theme.ambientGlow} text-slate-200 font-sans transition-colors duration-500`}>
      
      {/* Dark Vignette Overlay Around Edges */}
      <div className="fixed inset-0 pointer-events-none z-20 shadow-[inset_0_0_120px_rgba(0,0,0,0.9)]"></div>

      {/* Subtle Partial Border Frame with Fading Gold Lines */}
      <div className="fixed inset-0 pointer-events-none z-30 p-6 sm:p-10 flex flex-col justify-between">
        <div className="relative w-full flex items-center">
          <div className="absolute left-0 top-0 text-amber-500/20 font-serif text-lg">╔</div>
          <div className="w-full h-[1px] bg-gradient-to-r from-amber-500/30 via-amber-500/5 to-transparent mx-3"></div>
          <div className="absolute right-0 top-0 text-amber-500/20 font-serif text-lg">╗</div>
        </div>
        <div className="relative w-full flex items-center">
          <div className="absolute left-0 bottom-0 text-amber-500/15 font-serif text-lg">╚</div>
          <div className="w-full h-[1px] bg-gradient-to-r from-amber-500/20 via-amber-500/5 to-transparent mx-3"></div>
          <div className="absolute right-0 bottom-0 text-amber-500/15 font-serif text-lg">╝</div>
        </div>
      </div>

      {/* Lands Between Night Environment Background */}
      {isEldenRing && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute inset-0 bg-[#030302]"></div>
          <div className="absolute top-[12%] right-[22%] w-24 h-24 rounded-full bg-slate-200/5 blur-[2px]"></div>
          <div 
            className="absolute inset-0 opacity-40 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:48px_48px] pointer-events-none transition-transform duration-100 ease-out"
            style={{ transform: `translateY(-${scrollY * 0.1}px)` }}
          ></div>
          <div className="absolute bottom-[20%] left-0 right-0 h-48 bg-gradient-to-t from-amber-600/10 via-amber-900/5 to-transparent blur-2xl"></div>
          <div 
            className="absolute inset-0 flex items-end opacity-35 transition-transform duration-100 ease-out"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          >
            <svg className="w-full h-[55vh] text-[#070605]" viewBox="0 0 1440 500" preserveAspectRatio="none" fill="currentColor">
              <path d="M 0,350 L 150,280 L 280,320 L 450,200 L 600,260 L 780,140 L 950,220 L 1150,170 L 1300,250 L 1440,190 L 1440,500 L 0,500 Z" />
              <path d="M 0,420 L 200,380 L 400,410 L 650,350 L 900,390 L 1200,340 L 1440,380 L 1440,500 L 0,500 Z" fill="#040302" opacity="0.8" />
            </svg>
          </div>
          <div className="absolute bottom-[10%] inset-x-0 h-64 bg-gradient-to-t from-amber-950/10 via-slate-900/10 to-transparent blur-3xl opacity-60 animate-pulse"></div>
        </div>
      )}

      {/* Main Guide Layout Container */}
      <div className="relative z-20 min-h-screen py-10 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-8">
        
        {/* Top Bar Navigation & Filigree */}
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-4">
          <button
            onClick={() => navigate('/')}
            className="group text-xs uppercase tracking-[0.2em] text-amber-400/80 hover:text-amber-200 flex items-center gap-3 transition duration-300"
          >
            <span className="transform group-hover:-translate-x-1.5 transition duration-300 text-amber-500 group-hover:text-amber-300">‹</span>
            <span className="border-b border-transparent group-hover:border-amber-400/50 pb-0.5 transition duration-300">RETURN TO STRATEGY HUB</span>
          </button>
          <div className="text-amber-500/40 text-xs font-serif tracking-widest hidden sm:block">
            ◆ TARNISHED COMPANION HUD ◆
          </div>
        </div>

        {/* Hero Banner Card */}
        <div className={`group relative rounded-2xl overflow-hidden border bg-gradient-to-b from-amber-950/20 via-slate-950/80 to-slate-950 ${theme.cardBorder} ${theme.goldGlow} hover:border-amber-500/40 transition-all duration-300`}>
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={theme.bannerImg}
              alt={guide.gameTitle || 'Game Banner'}
              className="w-full h-full object-cover opacity-15 scale-105 filter saturate-150 group-hover:scale-110 group-hover:opacity-25 transition duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030302] via-[#030302]/70 to-transparent"></div>
          </div>

          <div className="relative p-8 sm:p-12 z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-block border text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-[0.2em] ${theme.accentColor}`}>
                {theme.badgeText}
              </span>
              <span className="text-amber-500/40 text-xs">◆</span>
              <span className="text-xs text-amber-400/70 uppercase tracking-widest font-serif">Strategy Intel</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif text-amber-100 tracking-wide mb-4 leading-tight font-normal drop-shadow-md">
              {guide.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-amber-200/60 font-serif pt-2 border-t border-amber-900/30 max-w-lg">
              <span>CONTRIBUTOR: <strong className="text-amber-300 font-normal">{guide.authorEmail || 'Anonymous'}</strong></span>
            </div>
          </div>
        </div>

        {/* Modular Guide Metadata Header Bar (Component 1) */}
        <div className={`bg-slate-950/80 border p-5 rounded-2xl backdrop-blur-md grid grid-cols-2 sm:grid-cols-4 gap-4 ${theme.cardBorder}`}>
          <div>
            <span className="text-[10px] uppercase font-serif tracking-widest text-amber-400/75 block">Difficulty</span>
            <span className="text-sm font-serif text-amber-200">★★☆☆☆ (Beginner)</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-serif tracking-widest text-amber-400/75 block">Est. Time</span>
            <span className="text-sm font-serif text-amber-200">3–5 Hours</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-serif tracking-widest text-amber-400/75 block">Region Focus</span>
            <span className="text-sm font-serif text-amber-200">Limgrave</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-serif tracking-widest text-amber-400/75 block">Last Updated</span>
            <span className="text-sm font-serif text-amber-200">2026 Companion Build</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column (Left 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`border p-5 rounded-xl bg-slate-950/70 backdrop-blur-md ${theme.cardBorder} hover:border-amber-500/40 transition-all duration-300`}>
                <span className="text-[11px] uppercase font-serif tracking-widest text-amber-400/70 block mb-1">
                  {theme.statLabel1}
                </span>
                <p className="text-xl font-serif text-amber-200">{theme.statValue1}</p>
              </div>
              <div className={`border p-5 rounded-xl bg-slate-950/70 backdrop-blur-md ${theme.cardBorder} hover:border-amber-500/40 transition-all duration-300`}>
                <span className="text-[11px] uppercase font-serif tracking-widest text-amber-400/70 block mb-1">
                  {theme.statLabel2}
                </span>
                <p className="text-xl font-serif text-amber-200">{theme.statValue2}</p>
              </div>
            </div>

            {/* Component 3: Multi-Type Pro Tips & Warnings */}
            <div className="space-y-4">
              <div className="bg-amber-950/20 border border-amber-500/30 p-5 rounded-xl flex items-start gap-3">
                <span className="text-amber-400 text-lg">💡</span>
                <div>
                  <h4 className="text-xs font-serif uppercase tracking-widest text-amber-300 mb-1">PRO TIP</h4>
                  <p className="text-xs text-amber-100/80 leading-relaxed">Rest at the Church of Elleh site of grace at night right after getting your steed whistle (Torrent) to trigger Ranni's arrival and receive the Spirit Calling Bell!</p>
                </div>
              </div>

              <div className="bg-rose-950/20 border border-rose-500/30 p-5 rounded-xl flex items-start gap-3">
                <span className="text-rose-400 text-lg">⚠️</span>
                <div>
                  <h4 className="text-xs font-serif uppercase tracking-widest text-rose-300 mb-1">CRITICAL WARNING</h4>
                  <p className="text-xs text-rose-100/80 leading-relaxed">Do not attack NPC merchants like Kale or Varre early in the game; it will permanently lock out vital questlines and vendor inventories.</p>
                </div>
              </div>
            </div>

            {/* Component 5: Step-by-Step Main Strategy Walkthrough */}
            <div className={`bg-slate-950/80 border rounded-2xl p-6 sm:p-10 space-y-6 backdrop-blur-md ${theme.cardBorder}`}>
              <div className="flex items-center justify-between border-b border-amber-900/40 pb-4">
                <h2 className="text-xl font-serif text-amber-200 tracking-wide flex items-center gap-3">
                  <span>{theme.icon}</span> Step-by-Step Walkthrough
                </h2>
                <span className="text-xs text-amber-500/40 font-serif uppercase tracking-widest">MODULE 01</span>
              </div>

              <div className="space-y-6 text-amber-100/90 text-sm sm:text-base font-sans">
                <div className="border-l-2 border-amber-500/40 pl-4 space-y-2">
                  <span className="text-xs font-serif uppercase tracking-widest text-amber-400">STEP 01 — Explore Limgrave</span>
                  <p className="leading-relaxed">Upon emerging from the tutorial dungeon, sneak past the Tree Sentinel boss. Activate the first Site of Grace and head north along the trail towards the Gatefront Ruins to establish fast-travel checkpoints.</p>
                </div>

                <div className="border-l-2 border-amber-500/40 pl-4 space-y-2">
                  <span className="text-xs font-serif uppercase tracking-widest text-amber-400">STEP 02 — Upgrade Your Character</span>
                  <p className="leading-relaxed">Rest at the Gatefront Ruins grace site to meet Melina. Accept her accord to receive Torrent, then purchase your Crafting Kit from Kalé at the Church of Elleh to prepare throwable pots and grease.</p>
                </div>

                <div className="border-l-2 border-amber-500/40 pl-4 space-y-2">
                  <span className="text-xs font-serif uppercase tracking-widest text-amber-400">STEP 03 — Prepare for Margit</span>
                  <p className="leading-relaxed">Travel down to the Weeping Peninsula to collect Golden Seeds and Sacred Tears. Maximize your flask charges and upgrade your primary weapon to +3 at the Church of Elleh anvil.</p>
                </div>

                <div className="border-l-2 border-amber-500/40 pl-4 space-y-2">
                  <span className="text-xs font-serif uppercase tracking-widest text-amber-400">STEP 04 — Enter Stormveil</span>
                  <p className="leading-relaxed">Approach the main gates of Stormveil Castle. Summon your Lone Wolf Ashes or Sorcerer Rogier once fighting Margit to split boss aggro and claim victory.</p>
                </div>
              </div>
            </div>

            {/* Component 6: Boss Encounter Module */}
            <div className={`bg-slate-950/80 border rounded-2xl p-6 sm:p-8 space-y-4 backdrop-blur-md ${theme.cardBorder}`}>
              <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
                <h3 className="text-lg font-serif text-amber-200 flex items-center gap-2">
                  <span>👹</span> Boss Encounter: Margit, the Fell Omen
                </h3>
                <span className="text-xs font-serif text-amber-400/80 bg-amber-950/30 px-2.5 py-1 rounded-full border border-amber-500/30">Difficulty: ★★★☆☆</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-serif text-amber-100/80 pt-2">
                <div className="bg-amber-950/20 p-3 rounded-lg border border-amber-900/30">
                  <strong className="text-amber-300 block mb-1 uppercase tracking-wider">Weaknesses</strong>
                  <p>• Bleed Buildup<br/>• Stagger / Poise Break from Jump Attacks</p>
                </div>
                <div className="bg-rose-950/20 p-3 rounded-lg border border-rose-900/30">
                  <strong className="text-rose-300 block mb-1 uppercase tracking-wider">Watch Out For</strong>
                  <p>• Delayed hammer slam combo<br/>• Flying dagger projectile throws</p>
                </div>
              </div>
            </div>

            {/* Component 7: Recommended Build Module */}
            <div className={`bg-slate-950/80 border rounded-2xl p-6 sm:p-8 space-y-4 backdrop-blur-md ${theme.cardBorder}`}>
              <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
                <h3 className="text-lg font-serif text-amber-200 flex items-center gap-2">
                  <span>🛡️</span> Recommended Build: Early Game Strength
                </h3>
                <span className="text-xs font-serif text-amber-400/80">Vagabond / Samurai</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-serif text-amber-100/80">
                <div className="bg-amber-950/20 p-3 rounded-lg border border-amber-900/30">
                  <span className="text-amber-400 block mb-0.5">Weapon</span>
                  <p className="text-amber-200 font-medium">Lordsworn's Greatsword / Uchigatana</p>
                </div>
                <div className="bg-amber-950/20 p-3 rounded-lg border border-amber-900/30">
                  <span className="text-amber-400 block mb-0.5">Shield</span>
                  <p className="text-amber-200 font-medium">Brass Shield (100% Physical Block)</p>
                </div>
                <div className="bg-amber-950/20 p-3 rounded-lg border border-amber-900/30">
                  <span className="text-amber-400 block mb-0.5">Key Stat Focus</span>
                  <p className="text-amber-200 font-medium">Vigor 25+ / Strength 16</p>
                </div>
              </div>
            </div>

            {/* Component 11: Secrets & Discoveries */}
            <div className={`bg-slate-950/80 border rounded-2xl p-6 sm:p-8 space-y-3 backdrop-blur-md ${theme.cardBorder}`}>
              <h3 className="text-sm font-serif text-amber-300 uppercase tracking-widest flex items-center gap-2">
                <span>💎</span> Hidden Discovery & Lore Secrets
              </h3>
              <div className="bg-amber-950/10 border border-amber-900/40 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif text-amber-200">Secret: Waygate trap inside Dragon-Burnt Ruins</span>
                  <button
                    onClick={() => toggleSecret('waygate')}
                    className="text-[11px] font-serif uppercase px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded border border-amber-500/30 transition"
                  >
                    {revealedSecrets['waygate'] ? 'Hide Secret' : 'Reveal Secret'}
                  </button>
                </div>
                {revealedSecrets['waygate'] && (
                  <p className="text-xs text-amber-100/80 mt-3 pt-3 border-t border-amber-900/40 leading-relaxed font-sans">
                    Inspecting the basement chest in the Dragon-Burnt Ruins transports you straight to the Sellia Crystal Tunnel in Caelid, granting early access to high-tier mid-game upgrade materials if you manage to escape!
                  </p>
                )}
              </div>
            </div>

            {/* Component 12: Common Mistakes */}
            <div className={`bg-slate-950/80 border rounded-2xl p-6 sm:p-8 space-y-3 backdrop-blur-md ${theme.cardBorder}`}>
              <h3 className="text-sm font-serif text-rose-300 uppercase tracking-widest flex items-center gap-2">
                <span>⚠️</span> Common Beginner Mistakes to Avoid
              </h3>
              <ul className="space-y-2 text-xs font-serif text-slate-300">
                <li className="flex items-center gap-2 text-rose-300/90">❌ <span>Spending runes randomly before reaching level 25 (Focus on Vigor first!)</span></li>
                <li className="flex items-center gap-2 text-rose-300/90">❌ <span>Ignoring weapon upgrade scaling requirements at blacksmith anvils</span></li>
                <li className="flex items-center gap-2 text-rose-300/90">❌ <span>Attempting to brute-force difficult field bosses without exploring secondary paths</span></li>
              </ul>
            </div>

            {/* Component 15: FAQ Accordion */}
            <div className={`bg-slate-950/80 border rounded-2xl p-6 sm:p-8 space-y-4 backdrop-blur-md ${theme.cardBorder}`}>
              <h3 className="text-sm font-serif text-amber-300 uppercase tracking-widest flex items-center gap-2 border-b border-amber-900/40 pb-3">
                <span>❓</span> Frequently Asked Questions
              </h3>
              <div className="space-y-3 text-xs font-serif">
                <div className="border border-amber-900/30 rounded-xl overflow-hidden bg-amber-950/10">
                  <button
                    onClick={() => toggleFaqAccordion(1)}
                    className="w-full text-left p-3.5 flex items-center justify-between text-amber-200 font-medium hover:bg-amber-950/20 transition"
                  >
                    <span>Can I skip Margit and go straight to Stormveil Castle?</span>
                    <span className="text-amber-400">{openFaq[1] ? '−' : '+'}</span>
                  </button>
                  {openFaq[1] && (
                    <div className="p-3.5 pt-0 text-amber-100/80 font-sans leading-relaxed border-t border-amber-900/30">
                      Yes! You can actually bypass Margit entirely by taking the cliffside path along the broken bridge to the right of Castle Stormveil into Liurnia of the Lakes, though defeating him makes future progression much smoother.
                    </div>
                  )}
                </div>

                <div className="border border-amber-900/30 rounded-xl overflow-hidden bg-amber-950/10">
                  <button
                    onClick={() => toggleFaqAccordion(2)}
                    className="w-full text-left p-3.5 flex items-center justify-between text-amber-200 font-medium hover:bg-amber-950/20 transition"
                  >
                    <span>Where should I go after clearing Limgrave?</span>
                    <span className="text-amber-400">{openFaq[2] ? '−' : '+'}</span>
                  </button>
                  {openFaq[2] && (
                    <div className="p-3.5 pt-0 text-amber-100/80 font-sans leading-relaxed border-t border-amber-900/30">
                      After Limgrave and the Weeping Peninsula, head north through Stormveil Castle into Liurnia of the Lakes, or explore the subterranean Siofra River well found in Mistwood.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Component 16: Related Guides */}
            <div className="pt-4 border-t border-amber-900/40 space-y-4">
              <h3 className="text-xs uppercase font-serif tracking-widest text-amber-400/80">Continue Your Journey</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950/80 border border-amber-500/20 p-4 rounded-xl hover:border-amber-500/40 transition cursor-pointer">
                  <span className="text-[10px] text-amber-400 font-serif block mb-1">BUILD GUIDE</span>
                  <h4 className="text-sm font-serif text-amber-200">Early Game Samurai Build</h4>
                </div>
                <div className="bg-slate-950/80 border border-amber-500/20 p-4 rounded-xl hover:border-amber-500/40 transition cursor-pointer">
                  <span className="text-[10px] text-amber-400 font-serif block mb-1">BOSS GUIDE</span>
                  <h4 className="text-sm font-serif text-amber-200">Godrick the Grafted Strategy</h4>
                </div>
                <div className="bg-slate-950/80 border border-amber-500/20 p-4 rounded-xl hover:border-amber-500/40 transition cursor-pointer">
                  <span className="text-[10px] text-amber-400 font-serif block mb-1">EQUIPMENT</span>
                  <h4 className="text-sm font-serif text-amber-200">Best Early Smithing Stone Locations</h4>
                </div>
              </div>
            </div>

          </div>

          {/* Elden Ring HUD Sidebar (Right 1/3) */}
          <div className="space-y-6">
            
            {/* 🔥 Guide Progress Widget */}
            <div className={`bg-slate-950/80 border p-6 rounded-2xl backdrop-blur-md space-y-4 ${theme.cardBorder}`}>
              <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
                <h3 className="text-sm font-serif text-amber-300 uppercase tracking-widest flex items-center gap-2">
                  <span>📊</span> Guide Progress
                </h3>
                <span className="text-xs font-serif text-amber-200">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-amber-900/40">
                <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <span className="text-[11px] font-serif text-amber-400/70 block text-center">{completedCount} / {objectives.length} objectives completed</span>
            </div>

            {/* Component 2: Interactive Key Objectives Checklists */}
            <div className={`bg-slate-950/80 border p-6 rounded-2xl backdrop-blur-md space-y-4 ${theme.cardBorder}`}>
              <h3 className="text-sm font-serif text-amber-300 uppercase tracking-widest border-b border-amber-900/40 pb-3 flex items-center gap-2">
                <span>⚜️</span> Key Objectives
              </h3>
              <ul className="space-y-2.5 text-xs text-amber-100/90 font-serif">
                {objectives.map((obj, index) => (
                  <li 
                    key={obj.id} 
                    onClick={() => toggleObjective(index)}
                    className="flex items-center gap-3 bg-amber-950/20 hover:bg-amber-950/40 p-3 rounded-lg border border-amber-900/30 cursor-pointer transition"
                  >
                    <span className={`text-base ${obj.completed ? 'text-emerald-400' : 'text-amber-500/60'}`}>
                      {obj.completed ? '✓' : '○'}
                    </span>
                    <span className={obj.completed ? 'line-through text-slate-400' : ''}>{obj.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Consumables / Items */}
            <div className={`bg-slate-950/80 border p-6 rounded-2xl backdrop-blur-md space-y-4 ${theme.cardBorder}`}>
              <h3 className="text-sm font-serif text-amber-300 uppercase tracking-widest border-b border-amber-900/40 pb-3 flex items-center gap-2">
                <span>🎒</span> Key Flask Upgrades
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-amber-950/20 border border-amber-700/30 p-3 rounded-xl text-center">
                  <span className="block text-lg mb-1">🧪</span>
                  <span className="text-[11px] font-serif text-amber-200 block">Golden Seed</span>
                  <span className="text-[9px] text-amber-400/60 font-serif">Flask Charges</span>
                </div>
                <div className="bg-amber-950/20 border border-amber-700/30 p-3 rounded-xl text-center">
                  <span className="block text-lg mb-1">🍷</span>
                  <span className="text-[11px] font-serif text-amber-200 block">Sacred Tear</span>
                  <span className="text-[9px] text-amber-400/60 font-serif">Flask Potency</span>
                </div>
              </div>
            </div>

            {/* Component 10: NPC Encounters List */}
            <div className={`bg-slate-950/80 border p-6 rounded-2xl backdrop-blur-md space-y-3 ${theme.cardBorder}`}>
              <h3 className="text-sm font-serif text-amber-300 uppercase tracking-widest border-b border-amber-900/40 pb-3 flex items-center gap-2">
                <span>👥</span> Key NPCs & Quests
              </h3>
              <ul className="space-y-2 text-xs font-serif text-amber-100/80">
                <li className="flex items-center justify-between bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/30">
                  <span>Melina</span>
                  <span className="text-emerald-400">✓ Met</span>
                </li>
                <li className="flex items-center justify-between bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/30">
                  <span>Merchant Kalé</span>
                  <span className="text-emerald-400">✓ Met</span>
                </li>
                <li className="flex items-center justify-between bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/30">
                  <span>Renna (Witch)</span>
                  <span className="text-amber-400">○ Available</span>
                </li>
              </ul>
            </div>

            {/* Lore Note */}
            <div className="border border-amber-900/30 bg-amber-950/10 p-5 rounded-2xl text-center space-y-2">
              <span className="text-amber-500/50 text-xs">◆ ◆ ◆</span>
              <p className="text-xs font-serif italic text-amber-200/70 leading-relaxed">
                "Brave Tarnished, seek the Elden Ring, and become the Elden Lord."
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}