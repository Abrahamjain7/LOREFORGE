import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import API from "./api/axios.js";
import { AuthProvider, useAuth } from './Context/AuthContext';
import Navbar from './Components/Navbar';
import GuideDetail from './Components/GuideDetail';
import AdminPanel from './Components/AdminPanel';
import BuildPlanner from './Components/BuildPlanner';
import BossCodex from './Components/BossCodex';
import LoreCodex from './Components/LoreCodex';
import { MOCK_GAMES, MOCK_GUIDES } from './data/mockGuides';
import { 
  Search, 
  Flame, 
  Sparkles, 
  Compass, 
  Shield, 
  BookOpen, 
  ArrowRight, 
  PlusCircle, 
  X, 
  ThumbsUp, 
  Trophy, 
  Bookmark, 
  Zap, 
  Skull, 
  Feather, 
  ChevronRight, 
  Filter 
} from 'lucide-react';

// Authentication Modal Component with Role Selection
function AuthModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Contributor');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      if (isRegister) {
        await API.post('/auth/register', { email, password, role, username: email.split('@')[0] });
        setSuccessMsg(`Account registered successfully as ${role}! Please sign in now.`);
        setIsRegister(false);
        setPassword('');
        return;
      }

      const response = await API.post('/auth/login', { email, password });
      login(response.data);
      onClose();
    } catch (err) {
      // If the server responded (e.g. 401 wrong password, 400 bad request) surface the error —
      // do NOT fall through to the offline fallback in these cases.
      if (err?.response) {
        setError(err.response.data || 'Invalid email or password.');
        return;
      }
      // Only reach here on a true network failure (no server response at all).
      console.warn('API unreachable, using offline session');
      login({
        email: email || 'tarnished@loreforge.com',
        role: role || 'Contributor',
        token: 'simulated_jwt_token'
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl space-y-6">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="text-xl font-serif text-slate-100">
            {isRegister ? 'Join the LoreForge Guild' : 'Tarnished Sign In'}
          </h3>
          <p className="text-xs text-slate-400 font-sans">
            {isRegister ? 'Create an account to forge guides, upvote strategies, and track progress.' : 'Enter your credentials to access your tactical command center.'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs p-3 rounded-xl">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div className="space-y-1.5">
            <label className="text-xs font-serif text-slate-300 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tarnished@loreforge.com"
              className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-serif text-slate-300 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none transition"
            />
          </div>

          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-serif text-slate-300 uppercase tracking-wider">Guild Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none transition cursor-pointer"
              >
                <option value="Contributor">Contributor (Create & Publish Guides)</option>
                <option value="Admin">Admin (Moderation & Content Review)</option>
                <option value="Reader">Reader (Explore & Upvote)</option>
              </select>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-serif font-semibold transition shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            {isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-900">
          <button 
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); setSuccessMsg(''); }}
            className="text-xs text-indigo-400 hover:underline font-serif cursor-pointer"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Automated Guide Submit Modal Component
function GuideSubmitModal({ isOpen, onClose, onGuideCreated }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [gameId, setGameId] = useState(1);
  const [difficulty, setDifficulty] = useState('Master');
  const [summary, setSummary] = useState('');
  const [steps, setSteps] = useState([{ title: '', description: '' }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAddStep = () => {
    setSteps([...steps, { title: '', description: '' }]);
  };

  const handleStepChange = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  const handleRemoveStep = (index) => {
    if (steps.length === 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formattedSteps = steps
      .filter(s => s.title.trim())
      .map((s, idx) => `### Step ${idx + 1}: ${s.title}\n${s.description}`)
      .join('\n\n');

    const fullContent = `${summary}\n\n## Walkthrough Steps\n\n${formattedSteps}`;
    const parsedGameId = parseInt(gameId, 10);
    const selectedGameObj = MOCK_GAMES.find(g => g.id === parsedGameId) || MOCK_GAMES[0];

    let createdDbId = null;
    try {
      const res = await API.post('/guides', {
        title,
        gameId: parsedGameId,
        content: fullContent
      });
      if (res.data?.guideId) {
        createdDbId = res.data.guideId;
      }
    } catch (err) {
      console.warn('API unavailable for guide save, persisting locally', err);
    }

    const newGuideObj = {
      id: createdDbId || Date.now(),
      title,
      gameId: parsedGameId,
      gameTitle: selectedGameObj.title,
      difficulty,
      content: fullContent,
      authorEmail: user?.email || 'You (Guild Contributor)',
      authorRole: user?.role || 'Contributor',
      authorId: user?.id || null,
      estimatedTime: '15 min read',
      upvotes: 1,
      createdAt: new Date().toISOString()
    };

    // Always update local storage custom guides
    let customGuides = [];
    const saved = localStorage.getItem('loreforge_custom_guides');
    if (saved) {
      try { customGuides = JSON.parse(saved); } catch { customGuides = []; }
    }
    customGuides = customGuides.filter(g => g.id !== newGuideObj.id);
    customGuides.unshift(newGuideObj);
    localStorage.setItem('loreforge_custom_guides', JSON.stringify(customGuides));

    setLoading(false);
    setTitle('');
    setSummary('');
    setSteps([{ title: '', description: '' }]);
    if (onGuideCreated) onGuideCreated(newGuideObj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 relative shadow-2xl space-y-6 my-8">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white transition cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="text-xl font-serif text-slate-100 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-400" /> Forge New Strategy Guide
          </h3>
          <p className="text-xs text-slate-400 font-sans">Build modular walkthrough steps and tactical intel for the community vault.</p>
        </div>

        {error && (
          <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs p-3 rounded-xl">
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 font-sans">
          <div className="space-y-1.5">
            <label className="text-xs font-serif text-slate-300 uppercase tracking-wider">Guide Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Caelid Underground Secret Route & Boss Strategy"
              className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-serif text-slate-300 uppercase tracking-wider">Game Universe</label>
              <select
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none transition cursor-pointer"
              >
                {MOCK_GAMES.map(g => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-serif text-slate-300 uppercase tracking-wider">Difficulty Rating</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none transition cursor-pointer"
              >
                <option value="Novice">Novice (Early Game / Basics)</option>
                <option value="Adept">Adept (Intermediate Builds)</option>
                <option value="Master">Master (High End-Game)</option>
                <option value="Grandmaster">Grandmaster (Honour / Death March / Hitless)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-serif text-slate-300 uppercase tracking-wider">Overview Summary</label>
            <textarea 
              required
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary of tactical objectives and gear requirements..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-sm text-slate-200 outline-none transition resize-none"
            />
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-900">
            <div className="flex items-center justify-between">
              <label className="text-xs font-serif text-indigo-300 uppercase tracking-wider">Modular Walkthrough Steps</label>
              <button
                type="button"
                onClick={handleAddStep}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1 cursor-pointer font-serif"
              >
                + Add Step
              </button>
            </div>

            {steps.map((step, index) => (
              <div key={index} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif text-slate-400">Step {index + 1}</span>
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(index)}
                      className="text-rose-400 hover:text-rose-300 text-xs cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder="Step Title (e.g., Defeat the Tree Sentinel)"
                  value={step.title}
                  onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition"
                />
                <textarea
                  required
                  rows={2}
                  placeholder="Describe tactics, gear recommendations, and routing..."
                  value={step.description}
                  onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-3 text-xs text-slate-200 outline-none transition resize-none"
                />
              </div>
            ))}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-serif font-semibold transition shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50 mt-4"
          >
            {loading ? 'Publishing to Vault...' : 'Publish Guide to Vault'}
          </button>
        </form>
      </div>
    </div>
  );
}

// User Bookmarks View
function BookmarksView() {
  const navigate = useNavigate();
  const [bookmarkedGuides, setBookmarkedGuides] = useState(() => {
    const saved = localStorage.getItem('loreforge_bookmarks');
    if (saved) {
      try {
        const ids = JSON.parse(saved);
        return MOCK_GUIDES.filter(g => ids.includes(g.id));
      } catch {
        return [];
      }
    }
    return [];
  });

  const handleRemoveBookmark = (e, id) => {
    e.stopPropagation();
    const updated = bookmarkedGuides.filter(g => g.id !== id);
    setBookmarkedGuides(updated);
    localStorage.setItem('loreforge_bookmarks', JSON.stringify(updated.map(g => g.id)));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-serif tracking-widest uppercase">
          <Bookmark className="w-3.5 h-3.5" /> Personal Lore Archive
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-slate-100">
          Saved Tactical Strategies ({bookmarkedGuides.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-sans">
          Quickly access your favorited boss strategies and walkthrough checkpoints.
        </p>
      </div>

      {bookmarkedGuides.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
          <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-serif text-slate-300">No guides saved yet</h3>
          <p className="text-xs text-slate-500 font-sans">
            Click the "Save" bookmark button on any walkthrough to store it in your personal vault.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-serif transition cursor-pointer"
          >
            Browse Strategy Vault
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedGuides.map((guide) => (
            <div
              key={guide.id}
              onClick={() => navigate(`/guides/${guide.id}`)}
              className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800/60 font-mono">
                    {guide.gameTitle}
                  </span>
                  <button
                    onClick={(e) => handleRemoveBookmark(e, guide.id)}
                    className="text-xs text-slate-500 hover:text-rose-400 font-serif"
                    title="Remove from bookmarks"
                  >
                    ✕ Remove
                  </button>
                </div>
                
                <h3 className="text-base font-serif font-semibold text-slate-100 hover:text-amber-300 transition">
                  {guide.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 font-sans">
                  {guide.content?.split('##')[0] || guide.content}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-serif">
                <span>By {guide.authorEmail?.split('@')[0]}</span>
                <span className="text-amber-400 flex items-center gap-1">Resume Intel →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Home Page View
function HomeView({ onOpenSubmit }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState('All Games');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(0);

  const fetchGuides = () => {
    API.get('/guides')
      .then((res) => {
        let loadedGuides = MOCK_GUIDES;
        if (res.data && res.data.length > 0) {
          // Merge API data with rich details
          const merged = res.data.map(g => {
            const mock = MOCK_GUIDES.find(m => m.id === g.id);
            return {
              ...mock,
              ...g,
              upvotes: g.upvotes ?? mock?.upvotes ?? 0
            };
          });
          // Add any mock guides that weren't in API
          MOCK_GUIDES.forEach(m => {
            if (!merged.some(g => g.id === m.id)) {
              merged.push(m);
            }
          });
          loadedGuides = merged;
        }

        // Include any custom created guides from localStorage
        const customSaved = localStorage.getItem('loreforge_custom_guides');
        if (customSaved) {
          try {
            const parsedCustom = JSON.parse(customSaved);
            const uniqueCustom = parsedCustom.filter(c => !loadedGuides.some(g => g.id === c.id));
            loadedGuides = [...uniqueCustom, ...loadedGuides];
          } catch {
            // ignore parse error
          }
        }

        setGuides(loadedGuides);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Backend unavailable, using rich mock compendium:', err.message);
        let loadedGuides = MOCK_GUIDES;
        const customSaved = localStorage.getItem('loreforge_custom_guides');
        if (customSaved) {
          try {
            const parsedCustom = JSON.parse(customSaved);
            const uniqueCustom = parsedCustom.filter(c => !loadedGuides.some(g => g.id === c.id));
            loadedGuides = [...uniqueCustom, ...loadedGuides];
          } catch {
            // ignore parse error
          }
        }
        setGuides(loadedGuides);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const handleQuickUpvote = async (e, guideId) => {
    e.stopPropagation();
    try {
      await API.post(`/guides/${guideId}/upvote`);
      setGuides(prev => prev.map(g => g.id === guideId ? { ...g, upvotes: (g.upvotes || 0) + 1 } : g));
    } catch {
      // Offline fallback: simulated upvote
      setGuides(prev => prev.map(g => g.id === guideId ? { ...g, upvotes: (g.upvotes || 0) + 1 } : g));
    }
  };

  const filteredGuides = guides.filter((guide) => {
    const matchesGame = selectedGame === 'All Games' || guide.gameTitle === selectedGame;
    const matchesDiff = selectedDifficulty === 'All' || guide.difficulty === selectedDifficulty;
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (guide.gameTitle && guide.gameTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (guide.tags && guide.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesGame && matchesDiff && matchesSearch;
  });

  const featuredGuides = guides.slice(0, 4);
  const activeFeatured = featuredGuides[activeFeaturedIndex] || featuredGuides[0] || MOCK_GUIDES[0];

  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* Logged-In User Welcome Banner */}
      {user && (
        <div className="bg-slate-950/80 border border-indigo-500/30 rounded-3xl p-6 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 text-xs uppercase tracking-widest font-serif">
              <Sparkles className="w-4 h-4" /> Tarnished Command Center
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-slate-100">
              Welcome back, <span className="text-indigo-300">{user.username || user.email?.split('@')[0]}</span>!
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Role: <strong className="text-indigo-300">{user.role}</strong> • Ready to explore strategy vaults or forge your own guides?
            </p>
          </div>
          {user && user.role !== 'Reader' && (
            <button
              onClick={onOpenSubmit}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-serif font-medium transition shadow-lg shadow-indigo-600/20 flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Forge New Strategy Guide
            </button>
          )}
        </div>
      )}

      {/* Cinematic Featured Showcase Hero */}
      {activeFeatured && (
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 p-8 sm:p-12 shadow-2xl group transition-all duration-700">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img 
              src={activeFeatured.gameTitle === 'Cyberpunk 2077' ? 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80' : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80'} 
              alt="Featured Hero" 
              className="w-full h-full object-cover opacity-20 filter saturate-150 transform group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#030302] via-[#030302]/90 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-serif tracking-widest uppercase">
                <Flame className="w-3.5 h-3.5" /> FEATURED COMMUNITY INTEL
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-indigo-300 font-mono">
                {activeFeatured.gameTitle}
              </span>
              <span className="text-xs text-slate-400 font-serif">
                {activeFeatured.estimatedTime || '20 min read'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-amber-100 leading-tight">
              {activeFeatured.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans line-clamp-3">
              {activeFeatured.content?.split('##')[0] || activeFeatured.content}
            </p>

            <div className="pt-3 flex items-center gap-4">
              <button 
                onClick={() => navigate(`/guides/${activeFeatured.id}`)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl text-xs sm:text-sm font-serif font-bold transition flex items-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer"
              >
                Explore Walkthrough <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {featuredGuides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFeaturedIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      activeFeaturedIndex === idx ? 'w-6 bg-amber-400' : 'bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Navigation Cards into New Creative Systems */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => navigate('/planner')}
          className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950 border border-indigo-500/30 hover:border-indigo-500 transition cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
          </div>
          <h4 className="text-base font-serif text-slate-100 mb-1">Interactive Build Planner</h4>
          <p className="text-xs text-slate-400 font-sans">Simulate stat distribution, equipment scaling, and export custom builds.</p>
        </div>

        <div 
          onClick={() => navigate('/bosses')}
          className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900/60 to-slate-950 border border-rose-500/30 hover:border-rose-500 transition cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
              <Skull className="w-5 h-5" />
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition" />
          </div>
          <h4 className="text-base font-serif text-slate-100 mb-1">Boss Encounter Codex</h4>
          <p className="text-xs text-slate-400 font-sans">Study attack telegraphs, parry windows, and damage vulnerabilities.</p>
        </div>

        <div 
          onClick={() => navigate('/lore')}
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900/60 to-slate-950 border border-amber-500/30 hover:border-amber-500 transition cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
              <Feather className="w-5 h-5" />
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
          </div>
          <h4 className="text-base font-serif text-slate-100 mb-1">World Lore & Mythos</h4>
          <p className="text-xs text-slate-400 font-sans">Read historical chronicles, faction wars, and cosmic mythologies.</p>
        </div>
      </div>

      {/* Universe Filters & Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedGame('All Games')}
              className={`px-4 py-2.5 rounded-xl text-xs font-serif transition border cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedGame === 'All Games'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>🎮</span> All Universes
            </button>

            {MOCK_GAMES.map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.title)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-serif transition border cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedGame === game.title
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{game.icon}</span> {game.title}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search guides, builds, lore..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition"
            />
          </div>
        </div>

        {/* Difficulty Sub-Filter */}
        <div className="flex items-center gap-2 text-xs font-serif text-slate-400">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span>Difficulty:</span>
          {['All', 'Novice', 'Adept', 'Master', 'Grandmaster'].map(d => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition cursor-pointer ${
                selectedDifficulty === d
                  ? 'bg-indigo-950 text-indigo-300 border border-indigo-700'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Main Guide Grid Feed & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Guide Cards Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-lg font-serif text-slate-200 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" /> Community Strategy Vault
            </h3>
            <span className="text-xs text-slate-400 font-serif">{filteredGuides.length} guides active</span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400 animate-pulse font-serif">
              Unrolling tactical archives...
            </div>
          ) : filteredGuides.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
              <Compass className="w-10 h-10 text-slate-600 mx-auto animate-spin" />
              <p className="text-slate-300 font-serif">No guides found matching your search criteria.</p>
              <button
                onClick={() => { setSelectedGame('All Games'); setSelectedDifficulty('All'); setSearchQuery(''); }}
                className="text-xs text-indigo-400 hover:underline font-serif cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredGuides.map((guide) => (
                <div
                  key={guide.id}
                  onClick={() => navigate(`/guides/${guide.id}`)}
                  className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 shadow-xl hover:shadow-indigo-500/10"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
                          {guide.gameTitle || 'Strategy'}
                        </span>
                        {guide.difficulty && (
                          <span className="text-[10px] font-serif text-slate-400">
                            • {guide.difficulty}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleQuickUpvote(e, guide.id)}
                        className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 font-serif bg-slate-950/60 border border-slate-800 px-2.5 py-1 rounded-lg transition"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-indigo-400" /> {guide.upvotes || 0}
                      </button>
                    </div>

                    <h4 className="text-base sm:text-lg font-serif text-slate-100 group-hover:text-indigo-300 transition line-clamp-2 leading-snug">
                      {guide.title}
                    </h4>

                    <p className="text-xs text-slate-400 font-sans line-clamp-3 leading-relaxed">
                      {guide.content?.split('##')[0] || guide.content}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-serif">
                    <span>By <strong className="text-slate-300">{guide.authorEmail?.split('@')[0] || 'Tarnished'}</strong></span>
                    <span className="text-indigo-400 group-hover:translate-x-1 transition duration-300 flex items-center gap-1">
                      Read Intel →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar: Contributor Leaderboard & Pulse */}
        <div className="space-y-6">
          {/* Contributor Leaderboard */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
            <h4 className="text-xs font-serif text-slate-200 uppercase tracking-widest border-b border-slate-800 pb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" /> Top Lore Scholars
            </h4>
            <div className="space-y-3 text-xs font-serif text-slate-300">
              <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-amber-500/30">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">#1</span>
                  <div>
                    <span className="text-slate-100 font-medium block">@LoreMasterX</span>
                    <span className="text-[10px] text-amber-400">Legendary Scholar</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono">142 Upvotes</span>
              </div>

              <div className="flex items-center justify-between bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">#2</span>
                  <div>
                    <span className="text-slate-200 font-medium block">@GhostInTheNet</span>
                    <span className="text-[10px] text-cyan-400">Master Tactician</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono">118 Upvotes</span>
              </div>

              <div className="flex items-center justify-between bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold">#3</span>
                  <div>
                    <span className="text-slate-300 font-medium block">@TavernBrawler</span>
                    <span className="text-[10px] text-purple-400">Honour Master</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono">94 Upvotes</span>
              </div>
            </div>
          </div>

          {/* Quick Boss Bounty Prompt */}
          <div className="border border-rose-900/40 bg-rose-950/15 p-6 rounded-3xl space-y-3">
            <Skull className="w-7 h-7 text-rose-400" />
            <h5 className="text-sm font-serif text-rose-200">Encounter Threat Alert</h5>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Facing Malenia, Adam Smasher, or Raphael? Access weakness breakdowns and timing counters in the Boss Codex.
            </p>
            <button
              onClick={() => navigate('/bosses')}
              className="w-full bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-500/40 py-2 rounded-xl text-xs font-serif transition cursor-pointer"
            >
              Open Boss Codex →
            </button>
          </div>

          {/* Forge Insights Widget */}
          <div className="border border-indigo-900/40 bg-indigo-950/10 p-6 rounded-3xl text-center space-y-3">
            <Shield className="w-8 h-8 text-indigo-400 mx-auto" />
            <h5 className="text-sm font-serif text-indigo-200">Got Tactical Insights?</h5>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Contribute your own boss strategies and secret discoveries to help fellow players conquer the toughest worlds.
            </p>
            {user && user.role !== 'Reader' && (
              <button
                onClick={onOpenSubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-xs font-serif transition cursor-pointer"
              >
                Submit Strategy Guide
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function AppInner() {
  const { user } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGuideCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const canForgeGuide = user && user.role !== 'Reader';

  return (
    <div className="min-h-screen bg-[#030302] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative">
      
      {/* Ambient Lighting Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-rose-600/10 rounded-full blur-[140px]"></div>
      </div>

      <div className="relative z-10">
        <Navbar 
          onOpenAuth={() => setIsAuthOpen(true)} 
          onOpenSubmit={() => {
            if (canForgeGuide) setIsSubmitOpen(true);
          }} 
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomeView key={refreshKey} onOpenSubmit={() => { if (canForgeGuide) setIsSubmitOpen(true); }} />} />
            <Route path="/guides/:id" element={<GuideDetail />} />
            <Route path="/planner" element={<BuildPlanner />} />
            <Route path="/bosses" element={<BossCodex />} />
            <Route path="/lore" element={<LoreCodex />} />
            <Route path="/bookmarks" element={<BookmarksView />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      {canForgeGuide && (
        <GuideSubmitModal isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} onGuideCreated={handleGuideCreated} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppInner />
      </Router>
    </AuthProvider>
  );
}