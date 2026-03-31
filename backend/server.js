const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'haricharan3333',
  database: 'alumniDB',
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL database: alumniDB');

  // Create users table (with role: 'user' | 'admin')
  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('user','admin') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('❌ Failed to create users table:', err.message);
    else console.log('✅ Users table ready');
  });

  // Migrate: add role column (ignore error if it already exists)
  db.query(`ALTER TABLE users ADD COLUMN role ENUM('user','admin') DEFAULT 'user'`, (err) => {
    if (err && err.code !== 'ER_DUP_FIELDNAME') {
      console.error('❌ Failed to add role column:', err.message);
    }
  });

  // Create alumni table
  db.query(`
    CREATE TABLE IF NOT EXISTS alumni (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      year INT NOT NULL,
      company VARCHAR(255) NOT NULL
    )
  `, (err) => {
    if (err) console.error('❌ Failed to create alumni table:', err.message);
    else console.log('✅ Alumni table ready');
  });

  // Create audit log table
  db.query(`
    CREATE TABLE IF NOT EXISTS alumni_audit_log (
      log_id      INT AUTO_INCREMENT PRIMARY KEY,
      alumni_id   INT,
      alumni_name VARCHAR(255),
      action      VARCHAR(50),
      logged_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('❌ Failed to create audit log table:', err.message);
    else console.log('✅ Audit log table ready');
  });

  // Create VIEW: alumni_summary
  db.query(`
    CREATE OR REPLACE VIEW alumni_summary AS
    SELECT id, name, email, year AS graduation_year, company,
      CONCAT('Class of ', year, ' | ', company) AS summary
    FROM alumni ORDER BY year DESC
  `, (err) => {
    if (err) console.error('❌ Failed to create view:', err.message);
    else console.log('✅ View alumni_summary ready');
  });

  // Create TRIGGER: log every alumni insert into audit log
  db.query(`DROP TRIGGER IF EXISTS after_alumni_insert`, () => {
    db.query(`
      CREATE TRIGGER after_alumni_insert
      AFTER INSERT ON alumni
      FOR EACH ROW
      BEGIN
        INSERT INTO alumni_audit_log (alumni_id, alumni_name, action)
        VALUES (NEW.id, NEW.name, 'INSERT');
      END
    `, (err) => {
      if (err) console.error('❌ Failed to create trigger:', err.message);
      else console.log('✅ Trigger after_alumni_insert ready');
    });
  });

  // Create messages table
  db.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      sender      VARCHAR(255) NOT NULL,
      receiver    VARCHAR(255) NOT NULL,
      message     TEXT NOT NULL,
      is_referral BOOLEAN DEFAULT FALSE,
      sent_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('❌ Failed to create messages table:', err.message);
    else console.log('✅ Messages table ready');
  });
});

// ─── AUTH ROUTES ──────────────────────────────────────────────

// POST /register — use admin code "ADMIN2026" to register as admin
app.post('/register', (req, res) => {
  const { name, email, password, adminCode } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const role = adminCode === 'ADMIN2026' ? 'admin' : 'user';

  // Check if name OR email already exists
  db.query('SELECT id FROM users WHERE email = ? OR name = ?', [email, name], (err, rows) => {
    if (err) {
      console.error('❌ Register check error:', err.message);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    if (rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Name or email already registered' });
    }

    db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role], (err, result) => {
        if (err) {
          console.error('❌ Register insert error:', err.message);
          return res.status(500).json({ success: false, message: 'Database error' });
        }
        console.log(`✅ User registered: ${name} (${role})`);
        res.status(201).json({ success: true, message: 'Registered successfully', user: { name, email, role } });
      });
  });
});

// POST /login
app.post('/login', (req, res) => {
  const { name, email, password, adminCode } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Step 1: Check if account exists by name + email
  db.query('SELECT * FROM users WHERE email = ? AND name = ?', [email, name], (err, rows) => {
    if (err) {
      console.error('❌ Login error:', err.message);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Login failed — account doesn't exist. Please register." });
    }

    // Step 2: Account found — now check password
    const user = rows[0];
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Wrong password. Please try again.' });
    }

    // Step 3: Determine role — admin code at login overrides DB role
    const role = adminCode === 'ADMIN2026' ? 'admin' : (user.role || 'user');
    console.log(`✅ User logged in: ${user.name} (${role})`);
    res.json({ success: true, message: 'Login successful', user: { name: user.name, email: user.email, role } });
  });
});

// ─── ALUMNI ROUTES ────────────────────────────────────────────

// POST /add-alumni
app.post('/add-alumni', (req, res) => {
  const { name, email, year, company } = req.body;

  if (!name || !email || !year || !company) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  db.query('INSERT INTO alumni (name, email, year, company) VALUES (?, ?, ?, ?)',
    [name, email, parseInt(year), company], (err, result) => {
      if (err) {
        console.error('❌ Error inserting alumni:', err.message);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ success: false, message: 'Alumni with this email already exists' });
        }
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      console.log(`✅ Alumni added: ${name}`);
      res.status(201).json({ success: true, message: 'Alumni added successfully', id: result.insertId });
    });
});

// GET /alumni
app.get('/alumni', (req, res) => {
  db.query('SELECT * FROM alumni ORDER BY id DESC', (err, results) => {
    if (err) {
      console.error('❌ Error fetching alumni:', err.message);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    console.log(`✅ Fetched ${results.length} alumni records`);
    res.json({ success: true, data: results });
  });
});

// DELETE /alumni/:id
app.delete('/alumni/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM alumni WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error deleting alumni:', err.message);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }
    console.log(`✅ Alumni deleted (ID: ${id})`);
    res.json({ success: true, message: 'Alumni deleted successfully' });
  });
});

// PUT /alumni/:id — edit alumni (admin only)
app.put('/alumni/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, year, company } = req.body;
  if (!name || !email || !year || !company) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  db.query('UPDATE alumni SET name=?, email=?, year=?, company=? WHERE id=?',
    [name, email, parseInt(year), company, id], (err, result) => {
      if (err) {
        console.error('❌ Error updating alumni:', err.message);
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'Email already exists' });
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Alumni not found' });
      console.log(`✅ Alumni updated (ID: ${id})`);
      res.json({ success: true, message: 'Alumni updated successfully' });
    });
});

// ─── MESSAGING ROUTES ─────────────────────────────────────────

// POST /send-message
app.post('/send-message', (req, res) => {
  const { sender, receiver, message, is_referral } = req.body;
  if (!sender || !receiver || !message) {
    return res.status(400).json({ success: false, message: 'Sender, receiver, and message required' });
  }
  db.query('INSERT INTO messages (sender, receiver, message, is_referral) VALUES (?, ?, ?, ?)',
    [sender, receiver, message, is_referral ? 1 : 0], (err, result) => {
      if (err) {
        console.error('❌ Error sending message:', err.message);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      console.log(`✅ Message: ${sender} → ${receiver}`);
      res.status(201).json({ success: true, message: 'Message sent', id: result.insertId });
    });
});

// GET /messages/:user — all conversations for a user (inbox)
app.get('/messages/:user', (req, res) => {
  const { user } = req.params;
  const query = `
    SELECT DISTINCT
      CASE WHEN sender = ? THEN receiver ELSE sender END AS contact,
      MAX(sent_at) AS last_message_at
    FROM messages
    WHERE sender = ? OR receiver = ?
    GROUP BY contact
    ORDER BY last_message_at DESC
  `;
  db.query(query, [user, user, user], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    res.json({ success: true, data: rows });
  });
});

// GET /messages/conversation/:a/:b — full chat thread
app.get('/messages/conversation/:a/:b', (req, res) => {
  const { a, b } = req.params;
  db.query(
    `SELECT * FROM messages WHERE (sender=? AND receiver=?) OR (sender=? AND receiver=?) ORDER BY sent_at ASC`,
    [a, b, b, a], (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });
      res.json({ success: true, data: rows });
    });
});

app.listen(PORT, () => {
  console.log(`🚀 Alumni Portal API running on http://localhost:${PORT}`);
});
