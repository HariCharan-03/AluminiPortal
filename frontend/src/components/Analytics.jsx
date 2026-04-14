import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000';

// ── Mini CSS-only bar-chart component ────────────────────────
function BarChart({ data, label, valueKey, labelKey, color = '#818cf8' }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d[valueKey]));
  return (
    <div className="space-y-2 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span
            className="text-xs text-indigo-300 text-right shrink-0 truncate"
            style={{ width: '120px', fontSize: '11px' }}
            title={item[labelKey]}
          >
            {item[labelKey]}
          </span>
          <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.round((item[valueKey] / max) * 100)}%`,
                background: `linear-gradient(90deg, ${color}, ${color}99)`,
              }}
            />
          </div>
          <span className="text-xs text-white font-semibold shrink-0" style={{ width: '24px' }}>
            {item[valueKey]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── SQL Query display card ────────────────────────────────────
function SQLCard({ title, query }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(99,102,241,0.2)' }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3 text-left"
      >
        <span className="text-indigo-300 text-sm font-semibold font-mono">{title}</span>
        <svg
          className={`w-4 h-4 text-indigo-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <pre
          className="px-5 pb-4 text-xs overflow-x-auto"
          style={{ color: '#a5f3fc', lineHeight: '1.7', fontFamily: "'Fira Code', 'Courier New', monospace" }}
        >
          {query.trim()}
        </pre>
      )}
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-1"
      style={{ background: color || 'rgba(99,102,241,0.12)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="text-2xl">{icon}</div>
      <div className="text-3xl font-bold text-white mt-1">{value ?? '—'}</div>
      <div className="text-indigo-300 text-sm font-medium">{label}</div>
      {sub && <div className="text-indigo-500 text-xs">{sub}</div>}
    </div>
  );
}

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/stats`)
      .then((res) => {
        if (res.data.success) setStats(res.data.data);
      })
      .catch(() => setError('Could not fetch analytics. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  const sections = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'company', label: '🏢 By Company' },
    { id: 'year', label: '📅 By Year' },
    { id: 'audit', label: '📋 Audit Log' },
    { id: 'queries', label: '🔍 SQL Queries' },
  ];

  if (loading) {
    return (
      <div className="animate-fade-in space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass rounded-2xl p-5 animate-pulse h-28" />
          ))}
        </div>
        <div className="glass rounded-2xl p-6 animate-pulse h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="glass rounded-2xl p-6 text-center"
        style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)' }}
      >
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const s = stats?.summary || {};

  return (
    <div className="animate-fade-in space-y-6">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics & SQL Reports</h2>
          <p className="text-indigo-400 text-sm mt-0.5">
            Live aggregate queries, JOINs, and audit log — powered by MySQL
          </p>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex gap-2 flex-wrap">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={
              activeSection === sec.id
                ? { background: 'rgba(99,102,241,0.3)', color: '#e0e7ff', border: '1px solid rgba(99,102,241,0.5)' }
                : { background: 'rgba(255,255,255,0.05)', color: '#818cf8', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon="🎓" label="Total Alumni" value={s.total_alumni} color="rgba(99,102,241,0.15)" />
            <StatCard icon="👤" label="Registered Users" value={s.total_users} color="rgba(139,92,246,0.15)" />
            <StatCard icon="🏢" label="Unique Companies" value={s.unique_companies} color="rgba(16,185,129,0.15)" />
            <StatCard icon="💬" label="Messages Sent" value={s.total_messages} color="rgba(245,158,11,0.15)" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard icon="📅" label="Avg Graduation Year" value={s.avg_year} color="rgba(59,130,246,0.12)" />
            <StatCard icon="⬆️" label="Latest Batch" value={s.max_year} color="rgba(34,197,94,0.12)" />
            <StatCard icon="⬇️" label="Earliest Batch" value={s.min_year} color="rgba(239,68,68,0.10)" />
          </div>

          {/* Quick chart preview */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>Top Companies</span>
            </h3>
            <BarChart
              data={stats?.byCompany}
              labelKey="company"
              valueKey="total"
              color="#818cf8"
            />
          </div>
        </div>
      )}

      {/* ── BY COMPANY ── */}
      {activeSection === 'company' && (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Alumni per Company</h3>
            <BarChart data={stats?.byCompany} labelKey="company" valueKey="total" color="#818cf8" />
          </div>

          {/* Table view */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <h3 className="text-white font-semibold text-sm">Full Table — Company Distribution</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(99,102,241,0.1)' }}>
                    <th className="text-left px-6 py-3 text-indigo-300 font-semibold">#</th>
                    <th className="text-left px-6 py-3 text-indigo-300 font-semibold">Company</th>
                    <th className="text-left px-6 py-3 text-indigo-300 font-semibold">Alumni Count</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.byCompany?.map((row, i) => (
                    <tr
                      key={i}
                      className="border-t transition-colors hover:bg-white/5"
                      style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                    >
                      <td className="px-6 py-3 text-indigo-500">{i + 1}</td>
                      <td className="px-6 py-3 text-white font-medium">{row.company}</td>
                      <td className="px-6 py-3">
                        <span
                          className="px-2.5 py-1 rounded-lg text-xs font-bold"
                          style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }}
                        >
                          {row.total}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── BY YEAR ── */}
      {activeSection === 'year' && (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Alumni per Graduation Year</h3>
            <BarChart data={stats?.byYear} labelKey="year" valueKey="graduates" color="#c084fc" />
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <h3 className="text-white font-semibold text-sm">Full Table — Year Distribution</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(139,92,246,0.1)' }}>
                    <th className="text-left px-6 py-3 text-indigo-300 font-semibold">Graduation Year</th>
                    <th className="text-left px-6 py-3 text-indigo-300 font-semibold">Graduates</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.byYear?.map((row, i) => (
                    <tr
                      key={i}
                      className="border-t transition-colors hover:bg-white/5"
                      style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                    >
                      <td className="px-6 py-3 text-white font-semibold">{row.year}</td>
                      <td className="px-6 py-3">
                        <span
                          className="px-2.5 py-1 rounded-lg text-xs font-bold"
                          style={{ background: 'rgba(139,92,246,0.2)', color: '#c4b5fd' }}
                        >
                          {row.graduates}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── AUDIT LOG ── */}
      {activeSection === 'audit' && (
        <div className="space-y-4">
          {/* JOIN result */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <h3 className="text-white font-semibold text-sm">Alumni × Audit Log Data</h3>
            </div>
            {stats?.auditJoin?.length === 0 ? (
              <div className="px-6 py-8 text-center text-indigo-500 text-sm">
                No audit entries yet. Add or delete an alumnus to see logs here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'rgba(99,102,241,0.08)' }}>
                      {['Alumni Name', 'Company', 'Year', 'Action', 'Logged At'].map((h) => (
                        <th key={h} className="text-left px-6 py-3 text-indigo-300 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.auditJoin?.map((row, i) => (
                      <tr
                        key={i}
                        className="border-t transition-colors hover:bg-white/5"
                        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                      >
                        <td className="px-6 py-3 text-white font-medium">{row.alumni_name}</td>
                        <td className="px-6 py-3 text-indigo-300">{row.company}</td>
                        <td className="px-6 py-3 text-indigo-300">{row.year}</td>
                        <td className="px-6 py-3">
                          <span
                            className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                            style={
                              row.action === 'INSERT'
                                ? { background: 'rgba(34,197,94,0.15)', color: '#4ade80' }
                                : { background: 'rgba(239,68,68,0.15)', color: '#f87171' }
                            }
                          >
                            {row.action}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-indigo-500 text-xs">
                          {new Date(row.logged_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* LEFT JOIN result */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <h3 className="text-white font-semibold text-sm">Alumni with or without Audit Entry</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(99,102,241,0.08)' }}>
                    {['Alumni Name', 'Year', 'Company', 'Audit Status'].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-indigo-300 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats?.leftJoin?.map((row, i) => (
                    <tr
                      key={i}
                      className="border-t transition-colors hover:bg-white/5"
                      style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                    >
                      <td className="px-6 py-3 text-white font-medium">{row.alumni_name}</td>
                      <td className="px-6 py-3 text-indigo-300">{row.year}</td>
                      <td className="px-6 py-3 text-indigo-300">{row.company}</td>
                      <td className="px-6 py-3">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={
                            row.audit_action === 'No log'
                              ? { background: 'rgba(100,116,139,0.2)', color: '#94a3b8' }
                              : { background: 'rgba(34,197,94,0.15)', color: '#4ade80' }
                          }
                        >
                          {row.audit_action}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SQL QUERIES ── */}
      {activeSection === 'queries' && (
        <div className="space-y-3">
          <p className="text-indigo-400 text-sm">
            All SQL queries used in this project — click to expand.
          </p>

          <SQLCard
            title="DDL — CREATE TABLE users"
            query={`CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('user','admin') DEFAULT 'user',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
          />

          <SQLCard
            title="DDL — CREATE TABLE alumni"
            query={`CREATE TABLE IF NOT EXISTS alumni (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(255) NOT NULL,
  email     VARCHAR(255) NOT NULL UNIQUE,
  year      INT NOT NULL,
  company   VARCHAR(255) NOT NULL
);`}
          />

          <SQLCard
            title="DDL — CREATE TABLE alumni_audit_log"
            query={`CREATE TABLE IF NOT EXISTS alumni_audit_log (
  log_id      INT AUTO_INCREMENT PRIMARY KEY,
  alumni_id   INT,
  alumni_name VARCHAR(255),
  action      VARCHAR(50),
  logged_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
          />

          <SQLCard
            title="DDL — CREATE VIEW alumni_summary"
            query={`CREATE OR REPLACE VIEW alumni_summary AS
SELECT id, name, email,
  year AS graduation_year,
  company,
  CONCAT('Class of ', year, ' | ', company) AS summary
FROM alumni
ORDER BY year DESC;`}
          />

          <SQLCard
            title="DDL — CREATE TRIGGER after_alumni_insert"
            query={`CREATE TRIGGER after_alumni_insert
AFTER INSERT ON alumni
FOR EACH ROW
BEGIN
  INSERT INTO alumni_audit_log (alumni_id, alumni_name, action)
  VALUES (NEW.id, NEW.name, 'INSERT');
END;`}
          />

          <SQLCard
            title="DDL — CREATE TRIGGER after_alumni_delete"
            query={`CREATE TRIGGER after_alumni_delete
AFTER DELETE ON alumni
FOR EACH ROW
BEGIN
  INSERT INTO alumni_audit_log (alumni_id, alumni_name, action)
  VALUES (OLD.id, OLD.name, 'DELETE');
END;`}
          />

          <SQLCard
            title="DML — INSERT sample alumni"
            query={`INSERT IGNORE INTO alumni (name, email, year, company) VALUES
  ('Priya Sharma',  'priya@example.com',  2021, 'Google'),
  ('Arjun Mehta',   'arjun@example.com',  2020, 'Microsoft'),
  ('Sneha Reddy',   'sneha@example.com',  2022, 'Amazon');`}
          />

          <SQLCard
            title="DML — UPDATE alumni company"
            query={`UPDATE alumni
SET company = 'Meta'
WHERE name = 'Priya Sharma';`}
          />

          <SQLCard
            title="DQL — SELECT all alumni"
            query={`SELECT * FROM alumni ORDER BY id DESC;`}
          />

          <SQLCard
            title="DQL — Aggregate: COUNT per company (GROUP BY)"
            query={`SELECT company, COUNT(*) AS total
FROM alumni
GROUP BY company
ORDER BY total DESC;`}
          />

          <SQLCard
            title="DQL — Aggregate: MAX / MIN / AVG graduation year"
            query={`SELECT
  MAX(year) AS latest_batch,
  MIN(year) AS earliest_batch,
  ROUND(AVG(year), 0) AS avg_graduation_year
FROM alumni;`}
          />

          <SQLCard
            title="DQL — HAVING: companies with more than 1 alumnus"
            query={`SELECT company, COUNT(*) AS cnt
FROM alumni
GROUP BY company
HAVING cnt > 1;`}
          />

          <SQLCard
            title="DQL — INNER JOIN: alumni × audit log"
            query={`SELECT
  a.name       AS alumni_name,
  a.company,
  a.year,
  l.action,
  l.logged_at
FROM alumni a
INNER JOIN alumni_audit_log l ON a.id = l.alumni_id
ORDER BY l.logged_at DESC;`}
          />

          <SQLCard
            title="DQL — LEFT JOIN: all alumni with or without log"
            query={`SELECT
  a.name       AS alumni_name,
  a.year,
  a.company,
  COALESCE(l.action, 'No log') AS audit_action
FROM alumni a
LEFT JOIN alumni_audit_log l ON a.id = l.alumni_id
ORDER BY a.year DESC;`}
          />

          <SQLCard
            title="DQL — Sub-query: latest batch alumni"
            query={`SELECT * FROM alumni
WHERE year = (SELECT MAX(year) FROM alumni);`}
          />

          <SQLCard
            title="DQL — Using the VIEW"
            query={`SELECT * FROM alumni_summary;`}
          />
        </div>
      )}
    </div>
  );
}
