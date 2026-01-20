-- =========================
-- USERS
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL,
  role VARCHAR(20) DEFAULT 'client',
  avatar VARCHAR(255) DEFAULT 'default.png'
);

-- =========================
-- APPOINTMENTS
-- =========================
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  professional INT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  message TEXT,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

-- =========================
-- AVAILABILITY
-- =========================
CREATE TABLE IF NOT EXISTS availability (
  id SERIAL PRIMARY KEY,
  professional_id INT NOT NULL,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  FOREIGN KEY (professional_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CHECK (end_time > start_time)
);

-- =========================
-- PAGES
-- =========================
CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  path VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- =========================
-- ASSIGNED PAGES
-- =========================
CREATE TABLE IF NOT EXISTS assigned_pages (
  id SERIAL PRIMARY KEY,
  page_id INT NOT NULL,
  role VARCHAR(20) NOT NULL,
  FOREIGN KEY (page_id) REFERENCES pages(id)
    ON DELETE CASCADE
);

-- =====================================================
-- DATA SEED
-- =====================================================

-- =========================
-- USERS (DEMO)
-- =========================
INSERT INTO users (name, lastname, email, password, role, avatar)
VALUES
(
  'Demo',
  'Client',
  'client@demo.com',
  '$2b$10$7yScogpzQ0V2iknk3ZtwEOfJkKyIzwjpxjNMrSZf7CfuSPcyB/EYW',
  'client',
  'client.png'
),
(
  'Demo',
  'Professional',
  'professional@demo.com',
  '$2b$10$7yScogpzQ0V2iknk3ZtwEOfJkKyIzwjpxjNMrSZf7CfuSPcyB/EYW',
  'professional',
  'professional.png'
);

-- =========================
-- AVAILABILITY (PROFESSIONAL)
-- Tuesday (2): 09:00 - 17:00
-- =========================
INSERT INTO availability (professional_id, day_of_week, start_time, end_time)
SELECT id, 2, '09:00', '17:00'
FROM users
WHERE email = 'professional@demo.com';

-- =========================
-- APPOINTMENT (DEMO)
-- =========================
INSERT INTO appointments (professional, date, time, status, message, user_id)
VALUES (
  (SELECT id FROM users WHERE email = 'professional@demo.com'),
  CURRENT_DATE + INTERVAL '1 day',
  '10:00',
  'accepted',
  'Demo appointment already accepted',
  (SELECT id FROM users WHERE email = 'client@demo.com')
);

-- =========================
-- PAGES
-- =========================
INSERT INTO pages (name, path, description)
VALUES
('Profile', 'profile', 'User profile page'),
('Dashboard', 'dashboard', 'Dashboard page'),
('My Appointments', 'appointments', 'User appointments page'),
('Appointments Request', 'p_appointments', 'Incoming appointment requests for professionals'),
('Book Appointment', 'book', 'Appointment booking page'),
('Availability', 'availability', 'Professional availability page'),
('Clients', 'clients', 'Professional clients page');

-- =========================
-- ASSIGNED PAGES (CLIENT)
-- =========================
INSERT INTO assigned_pages (page_id, role)
SELECT id, 'client'
FROM pages
WHERE path IN (
  'dashboard',
  'appointments',
  'book'
);

-- =========================
-- ASSIGNED PAGES (PROFESSIONAL)
-- =========================
INSERT INTO assigned_pages (page_id, role)
SELECT id, 'professional'
FROM pages
WHERE path IN (
  'dashboard',
  'p_appointments',
  'availability',
  'clients'
);
