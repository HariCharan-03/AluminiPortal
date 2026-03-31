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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>

      <div className="absolute top-[-10%] right-[-10%] w-80 h-80 rounded-full opacity-20 animate-pulse-slow"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
      <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 rounded-full opacity-15 animate-pulse-slow"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)', animationDelay: '1.5s' }} />

      <div className="relative z-10 w-full max-w-md px-6 py-8 animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Alumni Portal</h1>
          <p className="text-indigo-300 mt-1 text-sm">Join your alumni community today</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-indigo-300 text-sm font-medium mb-2">Full Name</label>
              <input id="register-name" type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="John Doe" required
                className="input-glass w-full rounded-xl px-4 py-3 text-white placeholder-indigo-400 focus:ring-0" />
            </div>
            <div>
              <label className="block text-indigo-300 text-sm font-medium mb-2">Email Address</label>
              <input id="register-email" type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="john@example.com" required
                className="input-glass w-full rounded-xl px-4 py-3 text-white placeholder-indigo-400 focus:ring-0" />
            </div>
            <div>
              <label className="block text-indigo-300 text-sm font-medium mb-2">Password</label>
              <input id="register-password" type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="Min. 6 characters" required
                className="input-glass w-full rounded-xl px-4 py-3 text-white placeholder-indigo-400 focus:ring-0" />
            </div>
            <div>
              <label className="block text-indigo-300 text-sm font-medium mb-2">Confirm Password</label>
              <input id="register-confirm" type="password" name="confirm" value={form.confirm} onChange={handleChange}
                placeholder="Repeat password" required
                className="input-glass w-full rounded-xl px-4 py-3 text-white placeholder-indigo-400 focus:ring-0" />
            </div>


            <button id="register-submit" type="submit" disabled={loading}
              className="btn-primary w-full py-3 rounded-xl text-white font-semibold text-base mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-indigo-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-300 font-semibold hover:text-white transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
