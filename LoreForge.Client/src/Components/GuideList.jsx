import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApprovedGuides } from '../api/LoreForgeApi.js';
import API from '../api/axios.js';

export default function GuideList() {
  const [guides, setGuides] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getApprovedGuides()
      .then((res) => {
        setGuides(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch guides:', err);
        setLoading(false);
      });
  }, []);

  const handleVote = async (e, guideId, type) => {
    e.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to vote.');
      return;
    }

    try {
      const response = await API.post(`/guides/${guideId}/${type}`);

      setGuides((prevGuides) =>
        prevGuides.map((g) =>
          g.id === guideId ? { ...g, upvotes: response.data.upvotes } : g
        )
      );
    } catch (err) {
      console.error('Error voting:', err);
      alert(err.response?.data || 'Failed to register vote. Check backend logs.');
    }
  };

  const filteredGuides = guides.filter((guide) =>
    guide.title.toLowerCase().includes(search.toLowerCase()) ||
    (guide.gameTitle && guide.gameTitle.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Loading guides...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Search Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-white">
          Explore <span className="text-blue-500">Community Strategy Guides</span>
        </h1>
        <p className="text-slate-400">
          Master your favorite games with tactics written by top contributors.
        </p>

        {/* Search Input */}
        <div className="mt-6 relative max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search guides by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition text-white placeholder-slate-500"
          />
          <span className="absolute left-3 top-3.5 text-slate-500">🔍</span>
        </div>
      </div>

      {/* Content Meta Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          📖 Published Guides
        </div>
        <span className="text-xs text-slate-500">{filteredGuides.length} total guides</span>
      </div>

      {/* Guides Grid */}
      {filteredGuides.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-800">
          <p className="text-slate-400">No approved guides found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              onClick={() => navigate(`/guides/${guide.id}`)}
              className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 rounded-xl p-5 transition flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <span className="inline-block bg-slate-700/50 text-slate-300 text-xs px-2.5 py-1 rounded-md mb-3 font-medium">
                  {guide.gameTitle || 'General'}
                </span>
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition mb-2">
                  {guide.title}
                </h3>
                <p className="text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {guide.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700/40 text-xs text-slate-400">
                <span>By {guide.authorEmail || 'Anonymous'}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleVote(e, guide.id, 'upvote')}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-700/60 hover:bg-blue-600/30 hover:text-blue-400 text-slate-300 rounded-lg transition font-medium"
                  >
                    👍 <span>{guide.upvotes || 0}</span>
                  </button>

                  <button
                    onClick={(e) => handleVote(e, guide.id, 'downvote')}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-700/60 hover:bg-red-600/30 hover:text-red-400 text-slate-300 rounded-lg transition font-medium"
                  >
                    👎
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}