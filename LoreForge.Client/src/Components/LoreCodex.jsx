import { useState } from 'react';
import { MOCK_LORE_ARCHIVES } from '../data/mockGuides';
import { Sparkles, Search, Feather, Clock } from 'lucide-react';

export default function LoreCodex() {
  const [selectedGame, setSelectedGame] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStory, setActiveStory] = useState(MOCK_LORE_ARCHIVES[0]);

  const gamesList = ['All', ...new Set(MOCK_LORE_ARCHIVES.map(l => l.game))];

  const filteredArchives = MOCK_LORE_ARCHIVES.filter(story => {
    const matchesGame = selectedGame === 'All' || story.game === selectedGame;
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          story.era.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          story.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          story.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGame && matchesSearch;
  });

  return (
    <div className="space-y-10 pb-16 animate-fade-in">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 p-8 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-serif tracking-widest uppercase">
            <Feather className="w-3.5 h-3.5" /> Mythos & Timeline Chronicles
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-slate-100">
            World Lore & Historical Compendium
          </h1>
          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            Delve into the foundational histories, cosmic wars, and divine tragedies of gaming's greatest fictional universes.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {gamesList.map(game => (
            <button
              key={game}
              onClick={() => setSelectedGame(game)}
              className={`px-4 py-2 rounded-xl text-xs font-serif transition border cursor-pointer whitespace-nowrap ${
                selectedGame === game
                  ? 'bg-amber-600 border-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-600/20'
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
            placeholder="Search mythos, characters, eras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 outline-none transition"
          />
        </div>
      </div>

      {/* Chronicle Reading Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Story Index */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase font-serif tracking-widest text-slate-400 mb-2 flex items-center justify-between">
            <span>Historical Chronicles ({filteredArchives.length})</span>
          </h3>

          <div className="space-y-3">
            {filteredArchives.map(story => (
              <div
                key={story.id}
                onClick={() => setActiveStory(story)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer space-y-2 ${
                  activeStory.id === story.id
                    ? 'bg-amber-950/40 border-amber-500/60 text-white shadow-xl shadow-amber-950/40'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300">
                    {story.game}
                  </span>
                  <span className="text-[11px] font-serif text-slate-400">{story.era}</span>
                </div>
                <h4 className="text-base font-serif font-semibold text-slate-100 leading-snug">
                  {story.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {story.summary}
                </p>
                <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                  {story.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-slate-950/80 text-slate-400 border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parchment Chronicle Reader */}
        <div className="lg:col-span-2 bg-gradient-to-b from-slate-900/90 via-slate-950 to-[#030302] border border-amber-500/30 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-6">
          {activeStory ? (
            <div className="space-y-6">
              <div className="border-b border-amber-500/20 pb-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-serif tracking-widest text-amber-400 font-bold">{activeStory.game}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 font-serif flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500/60" /> {activeStory.era}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-amber-100 leading-tight">
                  {activeStory.title}
                </h2>
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 font-serif italic">
                  "{activeStory.summary}"
                </div>
              </div>

              {/* Story Body */}
              <div className="prose prose-invert max-w-none text-slate-300 font-sans text-sm leading-relaxed space-y-4 whitespace-pre-line">
                {activeStory.fullText}
              </div>

              {/* Tag Cloud */}
              <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-serif text-slate-400">Codex Index:</span>
                  {activeStory.tags.map((t, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-serif">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-amber-400/80 font-serif flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Lore Forge Verified
                </span>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500 font-serif">
              Select a chronicle to open the mythos scroll.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
