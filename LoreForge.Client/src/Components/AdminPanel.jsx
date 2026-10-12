import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { MOCK_GUIDES } from '../data/mockGuides';
import { ShieldAlert, CheckCircle2, XCircle, Clock, BookOpen, ArrowLeft, RefreshCw } from 'lucide-react';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const fetchGuides = async () => {
    try {
      let res;
      try {
        res = await API.get('/admin/pending-guides');
      } catch {
        res = await API.get('/guides/all');
      }
      if (res.data && res.data.length > 0) {
        setGuides(res.data);
      } else {
        // Fallback to sample guides for admin inspection
        setGuides([
          {
            id: 99,
            title: "Elden Ring: Scadutree Chalice & Gaius Gravity Counter",
            gameTitle: "Elden Ring",
            authorEmail: "NewTarnished@loreforge.com",
            content: "Detailed walkthrough for dodging Commander Gaius boar charge with Raptor of the Mists.",
            isApproved: false,
            status: "Pending"
          },
          ...MOCK_GUIDES.slice(0, 4)
        ]);
      }
    } catch {
      console.warn('Admin API offline, loading simulated queue');
      setGuides([
        {
          id: 99,
          title: "Elden Ring: Scadutree Chalice & Gaius Gravity Counter",
          gameTitle: "Elden Ring",
          authorEmail: "NewTarnished@loreforge.com",
          content: "Detailed walkthrough for dodging Commander Gaius boar charge with Raptor of the Mists.",
          isApproved: false,
          status: "Pending"
        },
        ...MOCK_GUIDES.slice(0, 4)
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const handleApprove = async (id) => {
    try {
      await API.put(`/guides/${id}/approve`);
      setActionMsg(`Guide #${id} approved successfully.`);
      fetchGuides();
    } catch (err) {
      console.error('Failed to approve guide:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await API.post(`/admin/reject-guide/${id}`);
      setActionMsg(`Guide #${id} rejected.`);
      fetchGuides();
    } catch (err) {
      console.error('Failed to reject guide:', err);
    }
  };

  const pendingGuides = guides.filter(g => !g.isApproved && g.status !== 'Approved');
  const approvedGuides = guides.filter(g => g.isApproved || g.status === 'Approved');

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <button
            onClick={() => navigate('/')}
            className="text-xs uppercase tracking-widest text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mb-2 font-serif transition"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Hub
          </button>
          <h1 className="text-2xl sm:text-3xl font-serif text-slate-100 flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-indigo-400" /> Admin Moderation & Quality Control
          </h1>
          <p className="text-xs text-slate-400">Review community strategy submissions, maintain content integrity, and approve guides.</p>
        </div>

        <button
          onClick={() => { setLoading(true); fetchGuides(); }}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-serif flex items-center gap-2 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Queue
        </button>
      </div>

      {actionMsg && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs p-4 rounded-2xl flex items-center justify-between">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg('')} className="text-emerald-400 text-xs font-bold cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950/80 border border-indigo-500/20 p-5 rounded-2xl backdrop-blur-md">
          <span className="text-xs uppercase font-serif tracking-widest text-indigo-400 block mb-1">Total Submissions</span>
          <p className="text-2xl font-serif text-slate-100">{guides.length}</p>
        </div>
        <div className="bg-slate-950/80 border border-amber-500/20 p-5 rounded-2xl backdrop-blur-md">
          <span className="text-xs uppercase font-serif tracking-widest text-amber-400 block mb-1">Pending Approval</span>
          <p className="text-2xl font-serif text-amber-200">{pendingGuides.length}</p>
        </div>
        <div className="bg-slate-950/80 border border-emerald-500/20 p-5 rounded-2xl backdrop-blur-md">
          <span className="text-xs uppercase font-serif tracking-widest text-emerald-400 block mb-1">Published Guides</span>
          <p className="text-2xl font-serif text-emerald-200">{approvedGuides.length}</p>
        </div>
      </div>

      {/* Pending Guides Moderation Queue */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif text-slate-200 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" /> Pending Moderation Queue ({pendingGuides.length})
        </h3>

        {loading ? (
          <div className="py-12 text-center text-slate-400 font-serif animate-pulse">
            Loading moderation queue...
          </div>
        ) : pendingGuides.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-10 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-slate-300 font-serif text-sm">All community guides are moderated and active!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-6 space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700/50 mr-2">
                      {guide.gameTitle || 'Strategy'}
                    </span>
                    <span className="text-xs text-slate-400 font-serif">By {guide.authorEmail || 'Contributor'}</span>
                  </div>
                  <span className="text-xs text-amber-400 font-serif">Status: Pending Review</span>
                </div>

                <div>
                  <h4 className="text-lg font-serif text-slate-100 mb-2">{guide.title}</h4>
                  <p className="text-xs text-slate-300 font-sans line-clamp-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 leading-relaxed whitespace-pre-line">
                    {guide.content}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleReject(guide.id)}
                    className="bg-rose-950/60 hover:bg-rose-900 border border-rose-600/40 text-rose-300 px-4 py-2 rounded-xl text-xs font-serif flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" /> Reject Guide
                  </button>
                  <button
                    onClick={() => handleApprove(guide.id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-serif flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/20 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve & Publish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Published Guides List */}
      <div className="space-y-4 pt-6 border-t border-slate-900">
        <h3 className="text-lg font-serif text-slate-200 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" /> Active Published Vault ({approvedGuides.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {approvedGuides.map((guide) => (
            <div key={guide.id} className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-serif block">{guide.gameTitle || 'Strategy'}</span>
                <h5 className="text-sm font-serif text-slate-200">{guide.title}</h5>
              </div>
              <span className="text-xs text-emerald-400 font-serif bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-full">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}