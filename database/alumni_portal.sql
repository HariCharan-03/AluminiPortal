-- ============================================================
--  ALUMNI PORTAL — Complete Database Script
--  DBMS Final Project
--  Group Members: (Fill in your group names)
--  Subject: Database Management Systems
-- ============================================================

-- ============================================================
-- STEP 1: Create Database
-- ============================================================
CREATE DATABASE IF NOT EXISTS alumniDB;
USE alumniDB;

-- ============================================================
-- STEP 2: DDL — Create Tables
-- ============================================================
-- Normalization Notes:
--
-- 1NF (First Normal Form):
--   • All columns hold atomic (indivisible) values.
--   • Every row is uniquely identified by its PRIMARY KEY.
--   • No repeating groups or arrays in any column.
--
-- 2NF (Second Normal Form):
--   • Already in 1NF.
--   • All non-key attributes are FULLY functionally dependent
--     on the entire primary key (no partial dependencies).
--   • Since every table uses a single-column surrogate PK
--     (id INT AUTO_INCREMENT), there can be no partial
--     dependency — 2NF is satisfied automatically.
--
-- 3NF (Third Normal Form):
--   • Already in 2NF.
--   • No transitive dependencies: every non-key column
--     depends only on the PK, not on another non-key column.
--     e.g., in the alumni table, 'company' does NOT determine
--     'year', and 'year' does NOT determine 'company' — each
--     depends exclusively on 'id'.
--
-- BCNF (Boyce-Codd Normal Form):
--   • All tables satisfy BCNF because the only determinant
--     is the primary key column 'id'.
-- ============================================================

-- TABLE 1: users
-- Stores registered portal users (students / admins).
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,   -- Surrogate PK
  name        VARCHAR(255) NOT NULL,            -- Full name (atomic)
  email       VARCHAR(255) NOT NULL UNIQUE,     -- Unique identifier
  password    VARCHAR(255) NOT NULL,            -- Plain-text password (demo only)
  role        ENUM('user','admin') DEFAULT 'user', -- Access level
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- FDs: id → {name, email, password, role, created_at}   [3NF ✔]

-- TABLE 2: alumni
-- Stores alumni records (main data entity).
CREATE TABLE IF NOT EXISTS alumni (
  id        INT AUTO_INCREMENT PRIMARY KEY,     -- Surrogate PK
  name      VARCHAR(255) NOT NULL,              -- Alumnus full name
  email     VARCHAR(255) NOT NULL UNIQUE,       -- Contact email
  year      INT NOT NULL,                       -- Graduation year
  company   VARCHAR(255) NOT NULL               -- Current employer
);
-- FDs: id → {name, email, year, company}                [3NF ✔]

-- TABLE 3: alumni_audit_log
-- Automatically records every INSERT / DELETE on the alumni table.
CREATE TABLE IF NOT EXISTS alumni_audit_log (
  log_id      INT AUTO_INCREMENT PRIMARY KEY,
  alumni_id   INT,                              -- FK → alumni.id
  alumni_name VARCHAR(255),                     -- Denormalised for history
  action      VARCHAR(50),                      -- 'INSERT' or 'DELETE'
  logged_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- FDs: log_id → {alumni_id, alumni_name, action, logged_at}  [3NF ✔]

-- TABLE 4: messages
-- Stores peer-to-peer messages between portal users.
CREATE TABLE IF NOT EXISTS messages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  sender      VARCHAR(255) NOT NULL,            -- Sender's name
  receiver    VARCHAR(255) NOT NULL,            -- Receiver's name
  message     TEXT NOT NULL,                    -- Message body
  is_referral BOOLEAN DEFAULT FALSE,            -- Referral request flag
  sent_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- FDs: id → {sender, receiver, message, is_referral, sent_at} [3NF ✔]

-- ============================================================
-- STEP 3: DML — INSERT Sample Data
-- ============================================================

INSERT IGNORE INTO users (name, email, password, role) VALUES
  ('Admin User',    'admin@alumni.com',   'admin123', 'admin'),
  ('Hari Charan',   'hari@alumni.com',    'pass1234', 'user'),
  ('Priya Sharma',  'priya2@alumni.com',  'pass1234', 'user'),
  ('Arjun Mehta',   'arjun2@alumni.com',  'pass1234', 'user'),
  ('Sneha Reddy',   'sneha2@alumni.com',  'pass1234', 'user');

INSERT IGNORE INTO alumni (name, email, year, company) VALUES
  ('Priya Sharma',  'priya@example.com',  2021, 'Google'),
  ('Arjun Mehta',   'arjun@example.com',  2020, 'Microsoft'),
  ('Sneha Reddy',   'sneha@example.com',  2022, 'Amazon'),
  ('Rahul Gupta',   'rahul@example.com',  2019, 'Infosys'),
  ('Anjali Singh',  'anjali@example.com', 2023, 'Wipro'),
  ('Vikram Nair',   'vikram@example.com', 2017, 'TCS'),
  ('Divya Krishnan','divya@example.com',  2020, 'Google'),
  ('Nikhil Gupta',  'nikhil@example.com', 2018, 'IBM'),
  ('Aisha Khan',    'aisha@example.com',  2021, 'Accenture'),
  ('Rahul Bose',    'rbose@example.com',  2022, 'Deloitte');

-- ============================================================
-- STEP 4: CREATE VIEW
--   alumni_summary combines columns into a human-readable summary.
-- ============================================================

CREATE OR REPLACE VIEW alumni_summary AS
SELECT
  id,
  name,
  email,
  year   AS graduation_year,
  company,
  CONCAT('Class of ', year, ' | ', company) AS summary
FROM alumni
ORDER BY year DESC;

-- ============================================================
-- STEP 5: CREATE TRIGGERS
-- ============================================================

-- TRIGGER 1: Log every new alumni INSERT into audit log
DROP TRIGGER IF EXISTS after_alumni_insert;
DELIMITER $$
CREATE TRIGGER after_alumni_insert
AFTER INSERT ON alumni
FOR EACH ROW
BEGIN
  INSERT INTO alumni_audit_log (alumni_id, alumni_name, action)
  VALUES (NEW.id, NEW.name, 'INSERT');
END$$
DELIMITER ;

-- TRIGGER 2: Log every alumni DELETE into audit log
DROP TRIGGER IF EXISTS after_alumni_delete;
DELIMITER $$
CREATE TRIGGER after_alumni_delete
AFTER DELETE ON alumni
FOR EACH ROW
BEGIN
  INSERT INTO alumni_audit_log (alumni_id, alumni_name, action)
  VALUES (OLD.id, OLD.name, 'DELETE');
END$$
DELIMITER ;

-- ============================================================
-- STEP 6: DQL — SELECT Queries
-- ============================================================

-- 6a. Fetch ALL alumni (basic SELECT)
SELECT * FROM alumni;

-- 6b. Filter by company (WHERE clause)
SELECT * FROM alumni WHERE company = 'Google';

-- 6c. Search by graduation year range (BETWEEN)
SELECT name, email, year, company
FROM alumni
WHERE year BETWEEN 2019 AND 2022
ORDER BY year ASC;

-- 6d. Alumni who graduated after 2020 (comparison operator)
SELECT name, email, year, company
FROM alumni
WHERE year > 2020
ORDER BY year;

-- ── Aggregate Functions ─────────────────────────────────────

-- 6e. COUNT — total alumni
SELECT COUNT(*) AS total_alumni FROM alumni;

-- 6f. COUNT alumni per company (GROUP BY + ORDER BY)
SELECT company, COUNT(*) AS total
FROM alumni
GROUP BY company
ORDER BY total DESC;

-- 6g. COUNT alumni per graduation year
SELECT year, COUNT(*) AS graduates
FROM alumni
GROUP BY year
ORDER BY year DESC;

-- 6h. MAX / MIN / AVG graduation year
SELECT
  MAX(year) AS latest_batch,
  MIN(year) AS earliest_batch,
  ROUND(AVG(year), 0) AS avg_graduation_year
FROM alumni;

-- 6i. Companies with more than 1 alumnus (HAVING)
SELECT company, COUNT(*) AS cnt
FROM alumni
GROUP BY company
HAVING cnt > 1;

-- ── JOIN Queries ─────────────────────────────────────────────

-- 6j. INNER JOIN: alumni with their audit log entries
SELECT
  a.id,
  a.name       AS alumni_name,
  a.company,
  l.action,
  l.logged_at
FROM alumni a
INNER JOIN alumni_audit_log l ON a.id = l.alumni_id
ORDER BY l.logged_at DESC;

-- 6k. LEFT JOIN: all alumni (even those with no audit entry)
SELECT
  a.name       AS alumni_name,
  a.year,
  a.company,
  COALESCE(l.action, 'No log') AS audit_action,
  l.logged_at
FROM alumni a
LEFT JOIN alumni_audit_log l ON a.id = l.alumni_id
ORDER BY a.year DESC;

-- 6l. Use the VIEW
SELECT * FROM alumni_summary;

-- 6m. Sub-query: alumni who graduated in the latest batch year
SELECT * FROM alumni
WHERE year = (SELECT MAX(year) FROM alumni);

-- ============================================================
-- STEP 7: DML — UPDATE and DELETE Examples
-- ============================================================

-- Update employer of an alumnus
UPDATE alumni SET company = 'Meta' WHERE name = 'Priya Sharma';

-- Delete a test record (uncomment to run)
-- DELETE FROM alumni WHERE email = 'test@example.com';

-- ============================================================
-- STEP 8: Verify Data
-- ============================================================
SELECT 'users'            AS tbl, COUNT(*) AS rows FROM users   UNION ALL
SELECT 'alumni'           AS tbl, COUNT(*) AS rows FROM alumni  UNION ALL
SELECT 'alumni_audit_log' AS tbl, COUNT(*) AS rows FROM alumni_audit_log UNION ALL
SELECT 'messages'         AS tbl, COUNT(*) AS rows FROM messages;
