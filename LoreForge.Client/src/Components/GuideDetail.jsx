import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios.js';
import { useAuth } from '../Context/AuthContext.jsx';
import { MOCK_GUIDES } from '../data/mockGuides.js';
import { 
  ThumbsUp, 
  MessageSquare, 
  Send, 
  ArrowLeft, 
  CheckCircle2, 
  Shield, 
  Clock, 
  Sparkles, 
  Bookmark, 
  Share2, 
  Check, 
  Sword, 
  Zap, 
  Skull, 
  RotateCcw 
} from 'lucide-react';

// Dynamic Gaming Theme Presets for all 8 universes
const GAME_THEMES = {
  'Elden Ring': {
    pageBg: 'bg-[#030302] selection:bg-amber-500/30 selection:text-amber-200',
    ambientGlow: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/25 via-[#030302] to-[#010101]',
    cardBorder: 'border-amber-500/30 shadow-2xl shadow-black/80',
    accentColor: 'border-amber-500/40 text-amber-300 bg-amber-950/30',
    bannerImg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    badgeText: '✨ ELDEN RING',
    icon: '🗡️',
    statLabel1: 'Recommended Level',
    statValue1: 'RL 40 - 150+',
    statLabel2: 'Starting Region',
    statValue2: 'Limgrave & Shadow Realm',
    primaryBtn: 'bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-400',
  },
  'Cyberpunk 2077': {
    pageBg: 'bg-[#030712] selection:bg-cyan-500/30 selection:text-cyan-200',
    ambientGlow: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/30 via-[#030712] to-[#010206]',
    cardBorder: 'border-cyan-500/30 shadow-2xl shadow-black/80',
    accentColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/30',
    bannerImg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80',
    badgeText: '⚡ CYBERPUNK 2077',
    icon: '🤖',
    statLabel1: 'Operating System',
    statValue1: 'Cyberdeck Tier 5++',
    statLabel2: 'District',
    statValue2: 'Dogtown / Pacifica',
    primaryBtn: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border border-cyan-400',
  },
  'Valorant': {
    pageBg: 'bg-[#060911] selection:bg-rose-500/30 selection:text-rose-200',
    ambientGlow: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/30 via-[#060911] to-[#030408]',
    cardBorder: 'border-rose-500/30 shadow-2xl shadow-black/80',
    accentColor: 'border-rose-500/40 text-rose-300 bg-rose-950/30',
    bannerImg: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1600&q=80',
    badgeText: '🎯 VALORANT',
    icon: '💥',
    statLabel1: 'Recommended Role',
    statValue1: 'Initiator / Controller',
    statLabel2: 'Map Focus',
    statValue2: 'Ascent / Lotus',
    primaryBtn: 'bg-rose-600 hover:bg-rose-500 text-white border border-rose-400',
  },
  "Baldur's Gate 3": {
    pageBg: 'bg-[#05030a] selection:bg-purple-500/30 selection:text-purple-200',
    ambientGlow: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/30 via-[#05030a] to-[#020105]',
    cardBorder: 'border-purple-500/30 shadow-2xl shadow-black/80',
    accentColor: 'border-purple-500/40 text-purple-300 bg-purple-950/30',
    bannerImg: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
    badgeText: '🎲 BALDUR\'S GATE 3',
    icon: '🔮',
    statLabel1: 'Mode Ruleset',
    statValue1: 'Honour Mode (Single Save)',
    statLabel2: 'Tactical Key',
    statValue2: 'Legendary Action Disruption',
    primaryBtn: 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-400',
  },
  'The Witcher 3': {
    pageBg: 'bg-[#020804] selection:bg-emerald-500/30 selection:text-emerald-200',
    ambientGlow: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/30 via-[#020804] to-[#010302]',
    cardBorder: 'border-emerald-500/30 shadow-2xl shadow-black/80',
    accentColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30',
    bannerImg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    badgeText: '🐺 THE WITCHER 3',
    icon: '⚔️',
    statLabel1: 'Alchemy Build',
    statValue1: 'Euphoria Toxicity Matrix',
    statLabel2: 'Master Weapon',
    statValue2: 'Aerondight Silver Sword',
    primaryBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400',
  },
  'Hollow Knight': {
    pageBg: 'bg-[#03040e] selection:bg-indigo-500/30 selection:text-indigo-200',
    ambientGlow: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/30 via-[#03040e] to-[#010206]',
    cardBorder: 'border-indigo-500/30 shadow-2xl shadow-black/80',
    accentColor: 'border-indigo-500/40 text-indigo-300 bg-indigo-950/30',
    bannerImg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
    badgeText: '🪲 HOLLOW KNIGHT',
    icon: '🗡️',
    statLabel1: 'Arena Trial',
    statValue1: 'Pantheon of Hallownest',
    statLabel2: 'Nail Craft',
    statValue2: 'Pure Nail + Shaman Stone',
    primaryBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400',
  },
  'Zelda: Tears of the Kingdom': {
    pageBg: 'bg-[#020908] selection:bg-teal-500/30 selection:text-teal-200',
    ambientGlow: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-950/30 via-[#020908] to-[#010403]',
    cardBorder: 'border-teal-500/30 shadow-2xl shadow-black/80',
    accentColor: 'border-teal-500/40 text-teal-300 bg-teal-950/30',
    bannerImg: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80',
    badgeText: '🛡️ TEARS OF THE KINGDOM',
    icon: '✨',
    statLabel1: 'Autobuild Blueprint',
    statValue1: 'Hoverbike & War Mechs',
    statLabel2: 'Battery Matrix',
    statValue2: 'Max 16 Energy Cells',
    primaryBtn: 'bg-teal-600 hover:bg-teal-500 text-white border border-teal-400',
  },
  'God of War Ragnarök': {
    pageBg: 'bg-[#080504] selection:bg-amber-600/30 selection:text-amber-200',
    ambientGlow: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/30 via-[#080504] to-[#030201]',
    cardBorder: 'border-amber-600/30 shadow-2xl shadow-black/80',
    accentColor: 'border-amber-500/40 text-amber-300 bg-amber-950/30',
    bannerImg: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
    badgeText: '🪓 GOD OF WAR',
    icon: '❄️',
    statLabel1: 'Difficulty Target',
    statValue1: 'Give Me God of War',
    statLabel2: 'Primary Relic',
    statValue2: 'Hilt of Hofuð (Realm Shift)',
    primaryBtn: 'bg-amber-600 hover:bg-amber-500 text-white border border-amber-400',
  },
  'General': {
    pageBg: 'bg-slate-950 selection:bg-indigo-500/30 selection:text-indigo-200',
    ambientGlow: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/30 via-slate-950 to-slate-950',
    cardBorder: 'border-indigo-500/20 shadow-2xl shadow-black/80',
    accentColor: 'border-indigo-500/30 text-indigo-300 bg-indigo-950/30',
    bannerImg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
    badgeText: '🎮 STRATEGY HUB',
    icon: '📖',
    statLabel1: 'Difficulty',
    statValue1: 'Community Guide',
    statLabel2: 'Type',
    statValue2: 'Walkthrough Strategy',
    primaryBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400',
  }
};

// Content Parser to extract structured steps and summary
function parseGuideContent(rawContent) {
  if (!rawContent) return { summary: '', steps: [] };

  const lines = rawContent.split('\n');
  let summary = '';
  const steps = [];

  let currentStep = null;
  let inStepsSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.toLowerCase().startsWith('## walkthrough steps') || line.toLowerCase().startsWith('## steps')) {
      inStepsSection = true;
      continue;
    }

    if (line.startsWith('### Step') || line.match(/^###?\s*Step\s*\d+/i) || line.match(/^Step\s*\d+/i)) {
      if (currentStep) {
        steps.push(currentStep);
      }
      const titleMatch = line.replace(/^###?\s*/, '').trim();
      currentStep = {
        number: steps.length + 1,
        title: titleMatch,
        description: ''
      };
      inStepsSection = true;
    } else if (currentStep) {
      currentStep.description += (currentStep.description ? '\n' : '') + line;
    } else if (!inStepsSection && !line.startsWith('##')) {
      summary += (summary ? ' ' : '') + line;
    }
  }

  if (currentStep) {
    steps.push(currentStep);
  }

  // Fallback: If no structured headers were found, divide paragraphs
  if (steps.length === 0) {
    const paragraphs = rawContent.split('\n\n').filter(p => p.trim() && !p.startsWith('#'));
    summary = paragraphs[0] || rawContent;
    for (let idx = 1; idx < paragraphs.length; idx++) {
      steps.push({
        number: idx,
        title: `Phase ${idx}: Strategic Execution`,
        description: paragraphs[idx]
      });
    }
    if (steps.length === 0) {
      steps.push({
        number: 1,
        title: 'Core Walkthrough Instructions',
        description: rawContent
      });
    }
  }

  return { summary, steps };
}

export default function GuideDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upvotes, setUpvotes] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareToast, setShareToast] = useState('');
  const [activeTab, setActiveTab] = useState('steps'); // 'steps' | 'build' | 'bosses' | 'comments'

  // Objectives checklist state persisted per guide
  const [completedObjectives, setCompletedObjectives] = useState({});

  // Comments state
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const numericId = parseInt(id, 10);
  // Match the specific requested guide from mock guides or custom created local storage guides (do not hardcode fallback to Elden Ring)
  const localMatch = (() => {
    const fromMock = MOCK_GUIDES.find(g => g.id === numericId || String(g.id) === String(id));
    if (fromMock) return fromMock;
    try {
      const customGuides = JSON.parse(localStorage.getItem('loreforge_custom_guides') || '[]');
      return customGuides.find(g => g.id === numericId || String(g.id) === String(id)) || null;
    } catch {
      return null;
    }
  })();

  const fetchGuideDetails = async () => {
    try {
      const res = await API.get(`/guides/${id}`);
      if (res.data) {
        // Retrieve rich metadata matching this guide or game (loadouts, counters, difficulty)
        const richMeta = MOCK_GUIDES.find(g => g.id === res.data.id || String(g.id) === String(res.data.id))
          || (res.data.gameTitle ? MOCK_GUIDES.find(g => g.gameTitle === res.data.gameTitle) : null)
          || localMatch;

        const merged = {
          ...richMeta,
          ...res.data,
          difficulty: res.data.difficulty || richMeta?.difficulty || 'Master',
          estimatedTime: res.data.estimatedTime || richMeta?.estimatedTime || '15 min read',
          recommendedBuild: res.data.recommendedBuild || richMeta?.recommendedBuild || null,
          bossCounters: res.data.bossCounters || richMeta?.bossCounters || []
        };
        setGuide(merged);
        setUpvotes(res.data.upvotes ?? merged.upvotes ?? 0);
        setComments(res.data.comments || richMeta?.comments || []);
      }
    } catch {
      // Fallback seamlessly to local matching guide for this specific ID
      if (localMatch) {
        setGuide(localMatch);
        setUpvotes(localMatch.upvotes || 0);
        setComments(localMatch.comments || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuideDetails();

    // Check completed objectives from localStorage
    const savedChecks = localStorage.getItem(`loreforge_steps_${id}`);
    if (savedChecks) {
      try {
        setCompletedObjectives(JSON.parse(savedChecks));
      } catch {
        // ignore parse error
      }
    }

    // Check bookmarks
    const savedBookmarks = localStorage.getItem('loreforge_bookmarks');
    if (savedBookmarks) {
      try {
        const bm = JSON.parse(savedBookmarks);
        setIsBookmarked(bm.includes(numericId));
      } catch {
        // ignore parse error
      }
    }
  }, [id]);

  const toggleObjective = (index) => {
    const updated = {
      ...completedObjectives,
      [index]: !completedObjectives[index]
    };
    setCompletedObjectives(updated);
    localStorage.setItem(`loreforge_steps_${id}`, JSON.stringify(updated));
  };

  const resetObjectives = () => {
    setCompletedObjectives({});
    localStorage.removeItem(`loreforge_steps_${id}`);
  };

  const handleToggleBookmark = () => {
    let bm = [];
    const savedBookmarks = localStorage.getItem('loreforge_bookmarks');
    if (savedBookmarks) {
      try { bm = JSON.parse(savedBookmarks); } catch { bm = []; }
    }

    if (isBookmarked) {
      bm = bm.filter(bId => bId !== numericId);
      setIsBookmarked(false);
    } else {
      bm.push(numericId);
      setIsBookmarked(true);
    }
    localStorage.setItem('loreforge_bookmarks', JSON.stringify(bm));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareToast('Tactical guide link copied to clipboard!');
    setTimeout(() => setShareToast(''), 3000);
  };

  const handleUpvote = async () => {
    if (!user) {
      // Allow offline simulated upvote
      setUpvotes(prev => (hasUpvoted ? prev - 1 : prev + 1));
      setHasUpvoted(!hasUpvoted);
      return;
    }

    try {
      const res = await API.post(`/guides/${id}/upvote`);
      if (res.data && typeof res.data.upvotes === 'number') {
        setUpvotes(res.data.upvotes);
      } else {
        setUpvotes(prev => (hasUpvoted ? prev - 1 : prev + 1));
      }
      setHasUpvoted(!hasUpvoted);
    } catch {
      setUpvotes(prev => (hasUpvoted ? prev - 1 : prev + 1));
      setHasUpvoted(!hasUpvoted);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setSubmittingComment(true);

    const newCommentObj = {
      id: Date.now(),
      authorEmail: user ? user.email : 'Tarnished Scholar',
      authorRole: user ? user.role : 'Guild Member',
      text: newCommentText,
      createdAt: 'Just now'
    };

    try {
      await API.post(`/guides/${id}/comments`, { text: newCommentText });
      setComments([newCommentObj, ...comments]);
      setNewCommentText('');
      setSubmittingComment(false);
    } catch {
      // Offline fallback: save in state
      setComments([newCommentObj, ...comments]);
      setNewCommentText('');
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin"></div>
        <p className="text-indigo-400 font-serif tracking-widest text-xs uppercase animate-pulse">
          Retrieving Community Intel...
        </p>
      </div>
    );
  }

  const activeGuide = guide || localMatch;

  if (!activeGuide) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-4">
        <p className="text-slate-400 font-serif text-lg">Strategy Guide Not Found</p>
        <button
          onClick={() => navigate('/')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-serif transition cursor-pointer"
        >
          Return to Strategy Vault
        </button>
      </div>
    );
  }

  const theme = GAME_THEMES[activeGuide.gameTitle] || GAME_THEMES['General'];
  const { summary, steps } = parseGuideContent(activeGuide.content);

  const completedCount = steps.filter((_, idx) => completedObjectives[idx]).length;
  const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  const buildDetails = activeGuide.recommendedBuild;
  const bossCounters = activeGuide.bossCounters || [];

  return (
    <div className={`space-y-8 animate-fade-in`}>
      
      {/* Toast Notification */}
      {shareToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-300 px-5 py-3 rounded-2xl shadow-2xl text-xs font-serif flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" /> {shareToast}
        </div>
      )}

      {/* Top Bar Navigation & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <button
          onClick={() => navigate('/')}
          className="group text-xs uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2 transition duration-300 font-serif cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition duration-300" />
          <span>RETURN TO STRATEGY VAULT</span>
        </button>
        
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleToggleBookmark}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-serif transition border cursor-pointer ${
              isBookmarked
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-md shadow-amber-950'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Save to bookmarks"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{isBookmarked ? 'Bookmarked' : 'Save'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-serif transition border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            title="Share Guide Link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            onClick={handleUpvote}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif transition border cursor-pointer ${
              hasUpvoted
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-indigo-500 hover:text-white'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Upvote ({upvotes})</span>
          </button>
        </div>
      </div>

      {/* Hero Banner Card */}
      <div className={`relative rounded-3xl overflow-hidden border bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950 ${theme.cardBorder} p-6 sm:p-10 shadow-2xl`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={theme.bannerImg}
            alt={activeGuide.gameTitle || 'Banner'}
            className="w-full h-full object-cover opacity-20 filter saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030302] via-[#030302]/85 to-transparent"></div>
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-serif uppercase tracking-widest border ${theme.accentColor}`}>
              {theme.badgeText}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900/80 text-indigo-300 border border-slate-800 font-mono">
              {activeGuide.difficulty || 'Master'}
            </span>
            <span className="text-xs text-slate-400 font-serif flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {activeGuide.estimatedTime || '15 min read'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif text-slate-100 leading-tight">
            {activeGuide.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            {summary}
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs text-slate-400 font-serif border-t border-slate-800/80">
            <span>By <strong className="text-slate-200">{activeGuide.authorEmail?.split('@')[0] || 'LoreMaster'}</strong> ({activeGuide.authorRole || 'Legendary Scholar'})</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">✓ LoreForge Quality Verified</span>
          </div>
        </div>
      </div>

      {/* Interactive Walkthrough Progress Bar */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Progress Ring Dial */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-500 transition-all duration-500"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-mono font-bold text-slate-200">{progressPercent}%</span>
          </div>

          <div>
            <span className="text-xs font-serif uppercase tracking-wider text-indigo-400 block">
              Checklist Tracking
            </span>
            <h4 className="text-sm font-serif text-slate-200">
              {completedCount} of {steps.length} Steps Completed
            </h4>
          </div>
        </div>

        {completedCount > 0 && (
          <button
            onClick={resetObjectives}
            className="text-xs font-serif text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Checkpoints
          </button>
        )}
      </div>

      {/* Tactical Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('steps')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif transition cursor-pointer whitespace-nowrap ${
            activeTab === 'steps'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Walkthrough Checkpoints ({steps.length})
        </button>

        {buildDetails && (
          <button
            onClick={() => setActiveTab('build')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif transition cursor-pointer whitespace-nowrap ${
              activeTab === 'build'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sword className="w-3.5 h-3.5" /> Recommended Loadout
          </button>
        )}

        {bossCounters.length > 0 && (
          <button
            onClick={() => setActiveTab('bosses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif transition cursor-pointer whitespace-nowrap ${
              activeTab === 'bosses'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Skull className="w-3.5 h-3.5" /> Boss Counters ({bossCounters.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab('comments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif transition cursor-pointer whitespace-nowrap ${
            activeTab === 'comments'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> Intel & Tips ({comments.length})
        </button>
      </div>

      {/* Tab 1: Walkthrough Checkpoints */}
      {activeTab === 'steps' && (
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isDone = !!completedObjectives[index];
            return (
              <div
                key={index}
                onClick={() => toggleObjective(index)}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isDone
                    ? 'bg-slate-950/60 border-emerald-500/40 opacity-75'
                    : 'bg-slate-900/70 border-slate-800 hover:border-indigo-500/50 shadow-xl'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center transition border ${
                    isDone 
                      ? 'bg-emerald-600 border-emerald-400 text-white' 
                      : 'border-slate-700 bg-slate-950 text-transparent hover:border-indigo-400'
                  }`}>
                    <Check className="w-4 h-4" />
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-mono tracking-wider text-indigo-400">
                        Step {step.number || index + 1}
                      </span>
                      {isDone && (
                        <span className="text-[10px] uppercase font-serif text-emerald-400">
                          Completed
                        </span>
                      )}
                    </div>
                    <h3 className={`text-base font-serif font-semibold text-slate-100 ${isDone ? 'line-through text-slate-400' : ''}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-line">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Recommended Loadout */}
      {activeTab === 'build' && buildDetails && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-serif uppercase tracking-widest text-indigo-400">Recommended Battle Setup</span>
            <h3 className="text-2xl font-serif text-slate-100 mt-1">{buildDetails.name}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <span className="text-xs font-serif text-amber-400 flex items-center gap-1.5">
                <Sword className="w-3.5 h-3.5" /> Primary Weapons & Armaments
              </span>
              <p className="text-xs text-slate-200 font-sans">{buildDetails.weapons}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <span className="text-xs font-serif text-cyan-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Armor / Cyberware Chassis
              </span>
              <p className="text-xs text-slate-200 font-sans">{buildDetails.armor}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <span className="text-xs font-serif text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Talismans / Mutagens / Relics
              </span>
              <p className="text-xs text-slate-200 font-sans">{buildDetails.talismans}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <span className="text-xs font-serif text-rose-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Spells / Buffs / Quickhacks
              </span>
              <p className="text-xs text-slate-200 font-sans">{buildDetails.spells}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Boss Counters */}
      {activeTab === 'bosses' && (
        <div className="space-y-4">
          {bossCounters.map((bc, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-serif font-bold text-rose-400 flex items-center gap-2">
                  <Skull className="w-4 h-4" /> {bc.boss}
                </h4>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-900">
                  Target Counter
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {bc.strategy}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Community Discussion & Tips */}
      {activeTab === 'comments' && (
        <div className="space-y-6">
          <form onSubmit={handleAddComment} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs uppercase font-serif tracking-wider text-slate-300">
              Submit Community Intel / Boss Tip
            </h4>
            <textarea
              rows={3}
              required
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Share a tactical discovery, alternative route, or patch update..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-200 outline-none transition resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingComment}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-serif flex items-center gap-2 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Post Intel
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {comments.map((cmt) => (
              <div key={cmt.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-serif font-semibold text-slate-200">
                    @{cmt.authorEmail?.split('@')[0] || 'Tarnished'}
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">{cmt.createdAt || 'Recent'}</span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {cmt.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}