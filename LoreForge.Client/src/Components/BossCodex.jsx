import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_BOSSES } from '../data/mockGuides';
import { Skull, ShieldAlert, Zap, ArrowRight, Search, Flame, CheckCircle2 } from 'lucide-react';

export default function BossCodex() {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBossId, setSelectedBossId] = useState(MOCK_BOSSES[0]?.id || 'malenia');

  const gamesList = ['All', ...new Set(MOCK_BOSSES.map(b => b.game))];

  const filteredBosses = MOCK_BOSSES.filter(boss => {
    const matchesGame = selectedGame === 'All' || boss.game === selectedGame;
    const matchesSearch = boss.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          boss.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          boss.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGame && matchesSearch;
  });

  const activeBoss = MOCK_BOSSES.find(b => b.id === selectedBossId) || filteredBosses[0] || MOCK_BOSSES[0];

  return (
    <div className="space-y-10 pb-16 animate-fade-in">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-rose-500/30 bg-gradient-to-r from-rose-950/40 via-slate-950 to-slate-950 p-8 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-serif tracking-widest uppercase">
            <Skull className="w-3.5 h-3.5" /> Encounter Archives
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-slate-100">
            Legendary Boss & Encounter Codex
          </h1>
          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            Expose attack telegraphs, parry windows, and optimal counter rotations against the most punishing adversaries in modern gaming.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {gamesList.map(game => (
            <button
              key={game}
              onClick={() => setSelectedGame(game)}
              className={`px-4 py-2 rounded-xl text-xs font-serif transition border cursor-pointer whitespace-nowrap ${
                selectedGame === game
                  ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/20'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {game}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search bosses, moves, tell..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 outline-none transition"
          />
        </div>
      </div>

      {/* Main Encounter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Boss Selection List */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase font-serif tracking-widest text-slate-400 mb-2 flex items-center justify-between">
            <span>Target Profiles ({filteredBosses.length})</span>
          </h3>

          <div className="space-y-2.5">
            {filteredBosses.map(boss => (
              <button
                key={boss.id}
                onClick={() => setSelectedBossId(boss.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  activeBoss.id === boss.id
                    ? 'bg-rose-950/40 border-rose-500 text-white shadow-lg shadow-rose-950/40'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-rose-300">
                      {boss.game}
                    </span>
                    <span className="text-[10px] font-serif text-amber-400">{boss.threat}</span>
                  </div>
                  <h4 className="text-sm font-serif font-semibold text-slate-100">{boss.name}</h4>
                  <span className="text-xs text-slate-400 font-mono">{boss.health}</span>
                </div>
                <ArrowRight className={`w-4 h-4 transition ${activeBoss.id === boss.id ? 'text-rose-400 translate-x-1' : 'text-slate-600'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Boss Tactical Dossier */}
        <div className="lg:col-span-2 space-y-6 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {activeBoss && (
            <div className="space-y-6">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs uppercase font-serif tracking-widest text-rose-400">{activeBoss.game}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400 font-serif">{activeBoss.location}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-slate-100">{activeBoss.name}</h2>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-serif tracking-widest text-slate-400 block">Health Pool</span>
                  <span className="text-lg font-mono font-bold text-rose-400">{activeBoss.health}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                {activeBoss.description}
              </p>

              {/* Weaknesses and Resistances */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-serif uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Vulnerabilities & Weaknesses
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeBoss.weaknesses.map((w, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-serif uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" /> Resistances & Immunities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeBoss.resistances.map((r, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key Attack Tells & Counters */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-serif tracking-widest text-slate-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> Lethal Attack Telegraphs & Counters
                </h3>

                <div className="space-y-3">
                  {activeBoss.keyAttacks.map((atk, idx) => (
                    <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-amber-400" /> {atk.name}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-900">
                          Critical Move
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-sans">
                        <strong className="text-slate-300 font-serif">Visual Tell:</strong> {atk.tell}
                      </div>
                      <div className="text-xs text-emerald-300/90 font-sans bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-900/40">
                        <strong className="text-emerald-400 font-serif">Optimal Counter:</strong> {atk.counter}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Guide CTA */}
              {activeBoss.recommendedGuideId && (
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-serif text-indigo-300 block">Complete Boss Walkthrough Available</span>
                    <p className="text-[11px] text-slate-400">View detailed gear setup, route checkpoints, and video strategies.</p>
                  </div>
                  <button
                    onClick={() => navigate(`/guides/${activeBoss.recommendedGuideId}`)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-serif flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/20 cursor-pointer whitespace-nowrap"
                  >
                    Open Strategy Guide <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
