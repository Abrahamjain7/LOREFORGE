import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios.js';
import { MOCK_GUIDES } from '../data/mockGuides.js';
import { BookOpen, Search, ThumbsUp, ArrowRight } from 'lucide-react';

export default function GuideList() {
  const [guides, setGuides] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGame, setSelectedGame] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('upvotes');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/guides')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          // Merge API data with mock details if missing
          const merged = res.data.map(g => {
            const mockMatch = MOCK_GUIDES.find(m => m.id === g.id);
            return {
              ...mockMatch,
              ...g,
              upvotes: g.upvotes ?? mockMatch?.upvotes ?? 0
            };
          });
          setGuides(merged);
        } else {
          setGuides(MOCK_GUIDES);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Backend offline, loading client compendium:', err.message);
        setGuides(MOCK_GUIDES);
        setLoading(false);
      });
  }, []);

  const handleVote = async (e, guideId) => {
    e.stopPropagation();
    try {
      await API.post(`/guides/${guideId}/upvote`);
      setGuides(prev => prev.map(g => g.id === guideId ? { ...g, upvotes: (g.upvotes || 0) + 1 } : g));
    } catch {
      // Offline fallback
      setGuides(prev => prev.map(g => g.id === guideId ? { ...g, upvotes: (g.upvotes || 0) + 1 } : g));
    }
  };

  const gameOptions = ['All', ...new Set(guides.map(g => g.gameTitle).filter(Boolean))];
  const difficultyOptions = ['All', 'Novice', 'Adept', 'Master', 'Grandmaster'];

  const filteredGuides = guides
    .filter((g) => {
      const matchSearch = g.title.toLowerCase().includes(search.toLowerCase()) ||
                          (g.gameTitle && g.gameTitle.toLowerCase().includes(search.toLowerCase())) ||
                          (g.content && g.content.toLowerCase().includes(search.toLowerCase()));
      const matchGame = selectedGame === 'All' || g.gameTitle === selectedGame;
      const matchDiff = selectedDifficulty === 'All' || g.difficulty === selectedDifficulty;
      return matchSearch && matchGame && matchDiff;
    })
    .sort((a, b) => {
      if (sortBy === 'upvotes') return (b.upvotes || 0) - (a.upvotes || 0);
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return 0;
    });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-serif tracking-widest uppercase">
          <BookOpen className="w-3.5 h-3.5" /> Strategy Directory
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif text-slate-100">
          Community Strategy Archives
        </h1>
        <p className="text-sm text-slate-400 font-sans">
          Master challenging boss battles, build synergies, and modular route checklists.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto pt-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search guides, boss encounters, game mechanics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none shadow-xl transition"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-serif text-slate-400 mr-2">Universe:</span>
          {gameOptions.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGame(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-serif transition border cursor-pointer ${
                selectedGame === g
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-1.5 outline-none font-serif cursor-pointer"
          >
            {difficultyOptions.map(d => (
              <option key={d} value={d}>Difficulty: {d}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-1.5 outline-none font-serif cursor-pointer"
          >
            <option value="upvotes">Sort by: Upvotes</option>
            <option value="newest">Sort by: Newest</option>
          </select>
        </div>
      </div>

      {/* Guides Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-serif animate-pulse">
          Unrolling strategy scrolls...
        </div>
      ) : filteredGuides.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-2">
          <p className="text-slate-300 font-serif text-base">No strategy guides found matching criteria.</p>
          <p className="text-xs text-slate-500">Try adjusting your keyword or clearing universe filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              onClick={() => navigate(`/guides/${guide.id}`)}
              className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 shadow-xl hover:shadow-indigo-500/10"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
                    {guide.gameTitle || 'Strategy'}
                  </span>
                  <button
                    onClick={(e) => handleVote(e, guide.id)}
                    className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 font-serif bg-slate-950/60 border border-slate-800 px-2.5 py-1 rounded-lg transition"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-indigo-400" /> {guide.upvotes || 0}
                  </button>
                </div>
                
                <h3 className="text-base font-serif font-semibold text-slate-100 group-hover:text-indigo-300 transition line-clamp-2">
                  {guide.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-sans">
                  {guide.content?.split('##')[0] || guide.content}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-serif">
                <span>By <strong className="text-slate-300">{guide.authorEmail?.split('@')[0] || 'Tarnished'}</strong></span>
                <span className="text-indigo-400 group-hover:translate-x-1 transition duration-300 flex items-center gap-1">
                  Explore Intel <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}