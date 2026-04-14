import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      if (res.data.success) {
        toast.success('Account created! Sign in now.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
              <span className="text-white/60">Join </span>
              <span className="text-white">Alumni Portal</span>
            </span>
          </div>
          <h1 className="text-gradient-web3 text-3xl md:text-4xl font-medium tracking-tight">Create Account</h1>
          <p className="text-white/60 mt-2 text-sm max-w-xs leading-relaxed">Sign up to connect with your alumni community</p>
        </div>

        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Full Name</label>
              <input id="register-name" type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="John Doe" required
                className="w-full rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-white placeholder-white/30 focus:ring-1 focus:ring-white/50 focus:border-white/50 focus:outline-none transition-all" />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
              <input id="register-email" type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="john@example.com" required
                className="w-full rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-white placeholder-white/30 focus:ring-1 focus:ring-white/50 focus:border-white/50 focus:outline-none transition-all" />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
              <input id="register-password" type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="Min. 6 characters" required
                className="w-full rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-white placeholder-white/30 focus:ring-1 focus:ring-white/50 focus:border-white/50 focus:outline-none transition-all" />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Confirm Password</label>
              <input id="register-confirm" type="password" name="confirm" value={form.confirm} onChange={handleChange}
                placeholder="Repeat password" required
                className="w-full rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-white placeholder-white/30 focus:ring-1 focus:ring-white/50 focus:border-white/50 focus:outline-none transition-all" />
            </div>


            <button id="register-submit" type="submit" disabled={loading}
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
                      Creating account...
                    </>
                  ) : 'Create Account'}
                </span>
              </div>
            </button>
          </form>

          <p className="text-center text-white/50 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-semibold hover:text-white/80 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
