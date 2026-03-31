import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const GRADUATION_YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

export default function AlumniForm({ onAlumniAdded }) {
  const [form, setForm] = useState({ name: '', email: '', year: '', company: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.year || !form.company) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/add-alumni', {
        name: form.name,
        email: form.email,
        year: parseInt(form.year),
        company: form.company,
      });

      if (res.data.success) {
        toast.success(`🎓 ${form.name} added successfully!`);
        setForm({ name: '', email: '', year: '', company: '' });
        if (onAlumniAdded) onAlumniAdded();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add alumni';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <div className="glass rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Add New Alumni</h2>
            <p className="text-indigo-400 text-sm">Fill in the details to register an alumnus</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-indigo-300 text-sm font-medium mb-2">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Full Name
                </span>
              </label>
              <input
                id="alumni-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Priya Sharma"
                required
                className="input-glass w-full rounded-xl px-4 py-3 text-white placeholder-indigo-500 focus:ring-0"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-indigo-300 text-sm font-medium mb-2">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Address
                </span>
              </label>
              <input
                id="alumni-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="priya@example.com"
                required
                className="input-glass w-full rounded-xl px-4 py-3 text-white placeholder-indigo-500 focus:ring-0"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-indigo-300 text-sm font-medium mb-2">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Graduation Year
                </span>
              </label>
              <select
                id="alumni-year"
                name="year"
                value={form.year}
                onChange={handleChange}
                required
                className="input-glass w-full rounded-xl px-4 py-3 text-white focus:ring-0 appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
              >
                <option value="" className="bg-gray-900">Select Year</option>
                {GRADUATION_YEARS.map((yr) => (
                  <option key={yr} value={yr} className="bg-gray-900">{yr}</option>
                ))}
              </select>
            </div>

            {/* Company */}
            <div>
              <label className="block text-indigo-300 text-sm font-medium mb-2">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Company / Organization
                </span>
              </label>
              <input
                id="alumni-company"
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. Google, Microsoft"
                required
                className="input-glass w-full rounded-xl px-4 py-3 text-white placeholder-indigo-500 focus:ring-0"
              />
            </div>
          </div>

          <button
            id="alumni-submit"
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-xl text-white font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Adding Alumni...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add to Network
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
