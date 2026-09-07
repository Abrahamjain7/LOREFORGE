import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function AdminPanel() {
  const [pendingGuides, setPendingGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingGuides = async () => {
    try {
      // Assuming GET /api/Guides/pending returns unapproved guides for Admins
      const res = await API.get('/Guides');
      setPendingGuides(res.data.filter((guide) => !guide.isApproved));
      setLoading(false);
    } catch (err) {
      console.error('Failed to load pending guides:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingGuides();
  }, []);

  const handleApprove = async (id) => {
    try {
      await API.put(`/Guides/${id}/approve`);
      setPendingGuides(pendingGuides.filter((g) => g.id !== id));
    } catch (err) {
      console.error('Failed to approve guide:', err);
    }
  };

  if (loading) return <p>Loading admin moderation queue...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Moderation Queue</h2>
      {pendingGuides.length === 0 ? (
        <p>No pending guides for approval.</p>
      ) : (
        pendingGuides.map((guide) => (
          <div
            key={guide.id}
            style={{
              border: '1px solid #ffc107',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '5px',
            }}
          >
            <h3>{guide.title}</h3>
            <p>{guide.content}</p>
            <button
              onClick={() => handleApprove(guide.id)}
              style={{
                backgroundColor: '#28a745',
                color: '#fff',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Approve Guide
            </button>
          </div>
        ))
      )}
    </div>
  );
}