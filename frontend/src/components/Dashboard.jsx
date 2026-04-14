import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AlumniForm from './AlumniForm';
import AlumniList from './AlumniList';
import Messages from './Messages';
import Analytics from './Analytics';

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
    { id: 'analytics', label: 'Analytics' },
    ...(isAdmin ? [{ id: 'add', label: 'Add Alumni' }] : []),
  ];

  return (
    <div className="relative min-h-screen bg-black font-display text-white">
      {/* Fixed Background Video Layer */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <video 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 bg-black/60 backdrop-blur-xl border-b border-white/10 sticky top-0 px-6 py-4">
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
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border border-transparent ${activeTab === tab.id ? 'bg-white/10 border-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-black text-sm font-bold bg-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-white text-sm font-medium hidden sm:block">Welcome, {user.name}</span>
            </div>
            <button id="logout-btn" onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
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
      <div className="relative z-10 md:hidden flex gap-2 px-4 pt-4 overflow-x-auto bg-black/40 backdrop-blur-md pb-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${activeTab === tab.id ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-transparent text-white/50'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 animate-fade-in w-full">
        {/* Welcome banner */}
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Welcome back, <span className="text-gradient-web3">{user.name}</span>
              </h1>
              <p className="text-white/60 text-sm mt-2 max-w-md">
                {isAdmin ? 'Admin access: add, edit, delete alumni. Chat with the network.' : 'Search alumni, send messages, and request referrals.'}
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <button onClick={() => setActiveTab('messages')}
                className="pill-outer group">
                <div className="pill-inner-dark py-[8px] px-[20px] gap-2">
                  <div className="pill-glow group-hover:opacity-100 transition-opacity"></div>
                  <svg className="w-4 h-4 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-white text-[13px] font-medium relative z-10">Messages</span>
                </div>
              </button>
              {isAdmin && (
                <button onClick={() => setActiveTab('add')}
                  className="pill-outer group">
                  <div className="pill-inner-light py-[8px] px-[20px] gap-2">
                    <div className="pill-glow group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(ellipse at top, rgba(0, 0, 0, 0.4) 0%, transparent 70%)' }}></div>
                    <svg className="w-4 h-4 text-black relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-black text-[13px] font-medium relative z-10">Add Alumni</span>
                  </div>
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
        {activeTab === 'analytics' && (
          <Analytics />
        )}
        {activeTab === 'add' && isAdmin && (
          <AlumniForm onAlumniAdded={handleAlumniAdded} />
        )}
      </main>
    </div>
  );
}
