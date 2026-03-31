import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AlumniForm from './AlumniForm';
import AlumniList from './AlumniList';
import Messages from './Messages';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [refreshKey, setRefreshKey] = useState(0);
  const [alumni, setAlumni] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('alumni_user');
    if (!stored) { navigate('/login'); }
    else { setUser(JSON.parse(stored)); }
  }, [navigate]);

  // Fetch alumni list for messaging contact list
  useEffect(() => {
    axios.get('http://localhost:3000/alumni')
      .then(res => { if (res.data.success) setAlumni(res.data.data); })
      .catch(() => {});
  }, [refreshKey]);

  const handleLogout = () => {
    localStorage.removeItem('alumni_user');
    navigate('/login');
  };

  const handleAlumniAdded = () => {
    setRefreshKey((prev) => prev + 1);
    setActiveTab('list');
  };

  if (!user) return null;
  const isAdmin = user.role === 'admin';

  const tabs = [
    { id: 'list', label: 'Dashboard' },
    { id: 'messages', label: 'Messages' },
    ...(isAdmin ? [{ id: 'add', label: 'Add Alumni' }] : []),
  ];

  return (
    <div className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>

      {/* Navbar */}
      <nav className="glass-dark sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight">Alumni Portal</span>
              {isAdmin && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-lg font-semibold"
                  style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
                  👑 Admin
                </span>
              )}
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'text-white' : 'text-indigo-300 hover:text-white hover:bg-white/5'}`}
                style={activeTab === tab.id ? { background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' } : {}}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: isAdmin ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-white text-sm font-medium hidden sm:block">Welcome, {user.name}</span>
            </div>
            <button id="logout-btn" onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav */}
      <div className="md:hidden flex gap-2 px-4 pt-4 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'text-white' : 'text-indigo-300'}`}
            style={activeTab === tab.id ? { background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' } : { background: 'rgba(255,255,255,0.05)' }}>
            {tab.label}
          </button>
        ))}
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        {/* Welcome banner */}
        <div className="glass rounded-2xl p-6 mb-8"
          style={{ background: isAdmin ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(99,102,241,0.15))' : 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, <span className="text-gradient">{user.name}</span> {isAdmin ? '👑' : '👋'}
              </h1>
              <p className="text-indigo-300 text-sm mt-1">
                {isAdmin ? 'Admin access: add, edit, delete alumni. Chat with the network.' : 'Search alumni, send messages, and request referrals.'}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setActiveTab('messages')}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-indigo-300 flex items-center gap-2 transition-all hover:text-white"
                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Messages
              </button>
              {isAdmin && (
                <button onClick={() => setActiveTab('add')}
                  className="btn-primary px-4 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Alumni
                </button>
              )}
            </div>
          </div>
        </div>

        {activeTab === 'list' && (
          <AlumniList refreshKey={refreshKey} isAdmin={isAdmin}
            onRefresh={() => setRefreshKey(k => k + 1)} />
        )}
        {activeTab === 'messages' && (
          <Messages currentUser={user.name} alumni={alumni} />
        )}
        {activeTab === 'add' && isAdmin && (
          <AlumniForm onAlumniAdded={handleAlumniAdded} />
        )}
      </main>
    </div>
  );
}
