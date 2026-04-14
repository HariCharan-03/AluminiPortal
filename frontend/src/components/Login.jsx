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
    <div className="relative min-h-screen bg-black overflow-x-hidden font-display flex flex-col items-center justify-center">
      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <video 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        {/* 50% Black Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 animate-slide-up mt-8 mb-8">
        <div className="text-center mb-8 flex flex-col items-center">
          {/* Badge */}
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-[20px] px-4 py-1.5 backdrop-blur-sm mb-6 w-max">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <span className="text-[13px] font-medium whitespace-nowrap">
              <span className="text-white/60">Welcome to </span>
              <span className="text-white">Alumni Portal</span>
            </span>
          </div>
          <h1 className="text-gradient-web3 text-3xl md:text-4xl font-medium tracking-tight">Sign In</h1>
          <p className="text-white/60 mt-2 text-sm max-w-xs leading-relaxed">Enter your credentials to access the secure network</p>
        </div>

        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Full Name</label>
              <input id="login-name" type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="John Doe" required
                className="w-full rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-white placeholder-white/30 focus:ring-1 focus:ring-white/50 focus:border-white/50 focus:outline-none transition-all" />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
              <input id="login-email" type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="john@example.com" required
                className="w-full rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-white placeholder-white/30 focus:ring-1 focus:ring-white/50 focus:border-white/50 focus:outline-none transition-all" />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
              <input id="login-password" type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" required
                className="w-full rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-white placeholder-white/30 focus:ring-1 focus:ring-white/50 focus:border-white/50 focus:outline-none transition-all" />
            </div>

            {/* Admin code toggle */}
            <div>
              <button type="button" onClick={() => setShowAdminCode(!showAdminCode)}
                className="text-white/50 text-xs hover:text-white transition-colors flex items-center gap-1">
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
                  className="w-full rounded-xl bg-white/5 border border-white/20 px-4 py-2.5 text-white placeholder-white/30 focus:ring-1 focus:ring-white/50 focus:border-white/50 focus:outline-none transition-all mt-2 text-sm" />
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input id="remember-me" type="checkbox" checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded accent-white border border-white/30 cursor-pointer" />
              <label htmlFor="remember-me" className="text-white/70 text-sm cursor-pointer select-none">
                Remember me
              </label>
            </div>

            <button id="login-submit" type="submit" disabled={loading}
              className="pill-outer w-full mt-6 shadow-[0_4px_30px_rgba(255,255,255,0.2)] disabled:opacity-70 disabled:cursor-not-allowed group">
              <div className="pill-inner-light py-[14px]">
                <div className="pill-glow group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(ellipse at top, rgba(0, 0, 0, 0.4) 0%, transparent 70%)' }}></div>
                <span className="text-black text-[15px] font-semibold relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Signing in...
                    </>
                  ) : 'Sign In'}
                </span>
              </div>
            </button>
          </form>

          <p className="text-center text-white/50 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-white font-semibold hover:text-white/80 transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
