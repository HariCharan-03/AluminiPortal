-- ============================================================
-- ALUMNI PORTAL - Complete Database Script
-- DBMS Final Project
-- ============================================================

-- Step 1: Create Database
CREATE DATABASE IF NOT EXISTS alumniDB;
USE alumniDB;

-- ============================================================
-- Step 2: DDL - Create Tables
-- ============================================================

-- Users table (for login/registration)
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alumni table (main data)
CREATE TABLE IF NOT EXISTS alumni (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(255) NOT NULL,
  email     VARCHAR(255) NOT NULL UNIQUE,
  year      INT NOT NULL,
  company   VARCHAR(255) NOT NULL
);

-- Audit log table (records every alumni insert)
CREATE TABLE IF NOT EXISTS alumni_audit_log (
  log_id      INT AUTO_INCREMENT PRIMARY KEY,
  alumni_id   INT,
  alumni_name VARCHAR(255),
  action      VARCHAR(50),
  logged_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Step 3: DML - Sample INSERT Data
-- ============================================================

INSERT IGNORE INTO users (name, email, password) VALUES
  ('Admin User',  'admin@alumni.com', 'admin123'),
  ('Hari Charan', 'hari@alumni.com',  'pass1234');

INSERT IGNORE INTO alumni (name, email, year, company) VALUES
  ('Priya Sharma',  'priya@example.com',  2021, 'Google'),
  ('Arjun Mehta',   'arjun@example.com',  2020, 'Microsoft'),
  ('Sneha Reddy',   'sneha@example.com',  2022, 'Amazon'),
  ('Rahul Gupta',   'rahul@example.com',  2019, 'Infosys'),
  ('Anjali Singh',  'anjali@example.com', 2023, 'Wipro');

-- ============================================================
-- Step 4: CREATE VIEW
-- ============================================================

CREATE OR REPLACE VIEW alumni_summary AS
SELECT
  id,
  name,
  email,
  year AS graduation_year,
  company,
  CONCAT('Class of ', year, ' | ', company) AS summary
FROM alumni
ORDER BY year DESC;

-- ============================================================
-- Step 5: CREATE TRIGGER
--   Automatically logs every new alumni insert into alumni_audit_log
-- ============================================================

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

-- ============================================================
-- Step 6: DQL - SELECT Queries
-- ============================================================

-- 6a. Fetch all alumni
SELECT * FROM alumni;

-- 6b. Search by company (WHERE)
SELECT * FROM alumni WHERE company = 'Google';

-- 6c. Count alumni per company (GROUP BY + COUNT)
SELECT company, COUNT(*) AS total
FROM alumni
GROUP BY company
ORDER BY total DESC;

-- 6d. Count alumni per graduation year
SELECT year, COUNT(*) AS graduates
FROM alumni
GROUP BY year
ORDER BY year DESC;

-- 6e. Alumni who graduated after 2020
SELECT name, email, year, company
FROM alumni
WHERE year > 2020
ORDER BY year;

-- 6f. JOIN alumni with audit log to see insert history
SELECT a.name, a.company, l.action, l.logged_at
FROM alumni a
JOIN alumni_audit_log l ON a.id = l.alumni_id
ORDER BY l.logged_at DESC;

-- 6g. Use the VIEW
SELECT * FROM alumni_summary;

-- ============================================================
-- Step 7: DML - UPDATE and DELETE Examples
-- ============================================================

-- Update company of an alumnus
UPDATE alumni SET company = 'Meta' WHERE name = 'Priya Sharma';

-- Delete a test record (example)
-- DELETE FROM alumni WHERE email = 'test@example.com';
