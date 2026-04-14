import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AlumniList({ refreshKey, isAdmin }) {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', year: '', company: '' });
  const [editLoading, setEditLoading] = useState(false);

  const fetchAlumni = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:3000/alumni');
      if (res.data.success) setAlumni(res.data.data);
    } catch {
      setError('Failed to connect to server. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAlumni(); }, [refreshKey]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name} from alumni?`)) return;
    try {
      const res = await axios.delete(`http://localhost:3000/alumni/${id}`);
      if (res.data.success) { toast.success(`${name} removed`); fetchAlumni(); }
    } catch { toast.error('Failed to delete alumni'); }
  };

  const openEdit = (alumnus) => {
    setEditTarget(alumnus);
    setEditForm({ name: alumnus.name, email: alumnus.email, year: String(alumnus.year), company: alumnus.company });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await axios.put(`http://localhost:3000/alumni/${editTarget.id}`, editForm);
      if (res.data.success) { toast.success('Alumni updated!'); setEditTarget(null); fetchAlumni(); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setEditLoading(false); }
  };

  const filtered = alumni.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.company.toLowerCase().includes(search.toLowerCase()) ||
    String(a.year).includes(search)
  );

  const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const avatarColors = [
    'linear-gradient(135deg, #6366f1, #8b5cf6)',
    'linear-gradient(135deg, #8b5cf6, #ec4899)',
    'linear-gradient(135deg, #06b6d4, #6366f1)',
    'linear-gradient(135deg, #10b981, #6366f1)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
  ];

  const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="animate-fade-in">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Alumni Network</h2>
          <p className="text-indigo-400 text-sm mt-0.5">
            {loading ? 'Loading...' : `${alumni.length} member${alumni.length !== 1 ? 's' : ''} registered`}
          </p>
        </div>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input id="alumni-search" type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alumni..."
            className="input-glass rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-indigo-500 focus:ring-0 w-64" />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="glass rounded-2xl p-5 mb-6 flex items-start gap-3"
          style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)' }}>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/10" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-white/10 rounded-lg w-3/4" />
                  <div className="h-3 bg-white/10 rounded-lg w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-white/10 rounded-lg" />
                <div className="h-3 bg-white/10 rounded-lg w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="glass rounded-3xl p-12 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(99,102,241,0.2)' }}>
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">
            {search ? 'No results found' : 'No alumni yet'}
          </h3>
          <p className="text-indigo-400 text-sm">
            {search ? `No alumni matching "${search}"` : 'Be the first to add an alumnus using the Add Alumni tab.'}
          </p>
        </div>
      )}

      {/* Alumni Cards */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((alumnus, idx) => (
            <div key={alumnus.id} className="glass rounded-2xl p-5 card-hover cursor-default">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: avatarColors[idx % avatarColors.length] }}>
                  {getInitials(alumnus.name)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-semibold truncate">{alumnus.name}</h3>
                  <p className="text-indigo-400 text-xs truncate">{alumnus.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium"
                    style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Class of {alumnus.year}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium"
                    style={{ background: 'rgba(139,92,246,0.2)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.2)' }}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
                    </svg>
                    {alumnus.company}
                  </span>
                </div>
              </div>

              {/* Admin action buttons */}
              {isAdmin && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(alumnus)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-indigo-300 hover:text-white transition-colors"
                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(alumnus.id, alumnus.name)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats row */}
      {!loading && !error && alumni.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: 'Total Alumni', value: alumni.length, icon: '🎓', color: 'rgba(99,102,241,0.15)' },
            { label: 'Companies', value: new Set(alumni.map((a) => a.company)).size, icon: '🏢', color: 'rgba(139,92,246,0.15)' },
            { label: 'Batch Years', value: new Set(alumni.map((a) => a.year)).size, icon: '📅', color: 'rgba(192,132,252,0.15)' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-4 text-center" style={{ background: stat.color }}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-indigo-400 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setEditTarget(null); }}>
          <div className="glass rounded-3xl p-8 w-full max-w-md animate-slide-up shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Alumni
            </h3>
            <form onSubmit={handleEdit} className="space-y-4">
              {[['name', 'Full Name', 'text'], ['email', 'Email', 'email'], ['company', 'Company', 'text']].map(([field, label, type]) => (
                <div key={field}>
                  <label className="block text-indigo-300 text-sm font-medium mb-1.5">{label}</label>
                  <input type={type} value={editForm[field]}
                    onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                    required
                    className="input-glass w-full rounded-xl px-4 py-2.5 text-white placeholder-indigo-500 focus:ring-0" />
                </div>
              ))}
              <div>
                <label className="block text-indigo-300 text-sm font-medium mb-1.5">Graduation Year</label>
                <select value={editForm.year}
                  onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                  required className="input-glass w-full rounded-xl px-4 py-2.5 text-white focus:ring-0">
                  {YEARS.map((y) => (
                    <option key={y} value={y} className="bg-gray-900">{y}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditTarget(null)}
                  className="flex-1 py-2.5 rounded-xl text-indigo-300 text-sm font-medium transition-all hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Cancel
                </button>
                <button type="submit" disabled={editLoading}
                  className="flex-1 btn-primary py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-70">
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
