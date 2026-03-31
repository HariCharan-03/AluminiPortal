import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [remember, setRemember] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, go straight to dashboard
    if (localStorage.getItem('alumni_user')) {
      navigate('/dashboard');
      return;
    }
    // Pre-fill saved credentials if "Remember me" was used before
    const saved = localStorage.getItem('alumni_saved_creds');
    if (saved) {
      const creds = JSON.parse(saved);
      setForm(creds);
      setRemember(true);
    }
  }, [navigate]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('All fields are required');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/login', {
        name: form.name,
        email: form.email,
        password: form.password,
        adminCode: adminCode,
      });
      if (res.data.success) {
        localStorage.setItem('alumni_user', JSON.stringify(res.data.user));
        if (remember) {
          localStorage.setItem('alumni_saved_creds', JSON.stringify(form));
        } else {
          localStorage.removeItem('alumni_saved_creds');
        }
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>

      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full opacity-20 animate-pulse-slow"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full opacity-20 animate-pulse-slow"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-10 animate-pulse-slow"
        style={{ background: 'radial-gradient(circle, #c084fc, transparent)', animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-md px-6 animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Alumni Portal</h1>
          <p className="text-indigo-300 mt-1 text-sm">Welcome back! Sign in to continue</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-indigo-300 text-sm font-medium mb-2">Full Name</label>
              <input id="login-name" type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="John Doe" required
                className="input-glass w-full rounded-xl px-4 py-3 text-white placeholder-indigo-400 focus:ring-0" />
            </div>
            <div>
              <label className="block text-indigo-300 text-sm font-medium mb-2">Email Address</label>
              <input id="login-email" type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="john@example.com" required
                className="input-glass w-full rounded-xl px-4 py-3 text-white placeholder-indigo-400 focus:ring-0" />
            </div>
            <div>
              <label className="block text-indigo-300 text-sm font-medium mb-2">Password</label>
              <input id="login-password" type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" required
                className="input-glass w-full rounded-xl px-4 py-3 text-white placeholder-indigo-400 focus:ring-0" />
            </div>

            {/* Admin code toggle */}
            <div>
              <button type="button" onClick={() => setShowAdminCode(!showAdminCode)}
                className="text-indigo-400 text-xs hover:text-indigo-300 transition-colors flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {showAdminCode ? 'Hide admin code' : 'Sign in as admin?'}
              </button>
              {showAdminCode && (
                <input type="password" value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter admin code"
                  className="input-glass w-full rounded-xl px-4 py-2.5 text-white placeholder-indigo-400 focus:ring-0 mt-2 text-sm" />
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input id="remember-me" type="checkbox" checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-500 cursor-pointer" />
              <label htmlFor="remember-me" className="text-indigo-300 text-sm cursor-pointer select-none">
                Remember me
              </label>
            </div>

            <button id="login-submit" type="submit" disabled={loading}
              className="btn-primary w-full py-3 rounded-xl text-white font-semibold text-base mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-indigo-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-300 font-semibold hover:text-white transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
