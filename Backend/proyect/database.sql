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
-- DATA SEED (CON CONDICIONES PARA EVITAR DUPLICADOS)
-- =====================================================

-- =========================
-- USERS (DEMO) - Solo insertar si no existen
-- =========================
INSERT INTO users (name, lastname, email, password, role, avatar)
SELECT 'Demo', 'Client', 'client@demo.com', '$2b$10$7yScogpzQ0V2iknk3ZtwEOfJkKyIzwjpxjNMrSZf7CfuSPcyB/EYW', 'client', 'client.png'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'client@demo.com');

INSERT INTO users (name, lastname, email, password, role, avatar)
SELECT 'Demo', 'Professional', 'professional@demo.com', '$2b$10$7yScogpzQ0V2iknk3ZtwEOfJkKyIzwjpxjNMrSZf7CfuSPcyB/EYW', 'professional', 'professional.png'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'professional@demo.com');

-- =========================
-- AVAILABILITY (PROFESSIONAL)
-- Tuesday (2): 09:00 - 17:00
-- =========================
INSERT INTO availability (professional_id, day_of_week, start_time, end_time)
SELECT 
  (SELECT id FROM users WHERE email = 'professional@demo.com'), 
  2, '09:00', '17:00'
WHERE NOT EXISTS (
  SELECT 1 FROM availability 
  WHERE professional_id = (SELECT id FROM users WHERE email = 'professional@demo.com')
  AND day_of_week = 2
);

-- =========================
-- APPOINTMENT (DEMO)
-- =========================
INSERT INTO appointments (professional, date, time, status, message, user_id)
SELECT 
  (SELECT id FROM users WHERE email = 'professional@demo.com'),
  CURRENT_DATE + INTERVAL '1 day',
  '10:00',
  'accepted',
  'Demo appointment already accepted',
  (SELECT id FROM users WHERE email = 'client@demo.com')
WHERE NOT EXISTS (
  SELECT 1 FROM appointments 
  WHERE user_id = (SELECT id FROM users WHERE email = 'client@demo.com')
  AND professional = (SELECT id FROM users WHERE email = 'professional@demo.com')
  AND date = CURRENT_DATE + INTERVAL '1 day'
);

-- =========================
-- PAGES - Solo insertar si no existen
-- =========================
INSERT INTO pages (name, path, description)
SELECT 'Profile', 'profile', 'User profile page'
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE path = 'profile');

INSERT INTO pages (name, path, description)
SELECT 'Dashboard', 'dashboard', 'Dashboard page'
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE path = 'dashboard');

INSERT INTO pages (name, path, description)
SELECT 'My Appointments', 'appointments', 'User appointments page'
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE path = 'appointments');

INSERT INTO pages (name, path, description)
SELECT 'Appointments Request', 'p_appointments', 'Incoming appointment requests for professionals'
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE path = 'p_appointments');

INSERT INTO pages (name, path, description)
SELECT 'Book Appointment', 'book', 'Appointment booking page'
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE path = 'book');

INSERT INTO pages (name, path, description)
SELECT 'Availability', 'availability', 'Professional availability page'
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE path = 'availability');

INSERT INTO pages (name, path, description)
SELECT 'Clients', 'clients', 'Professional clients page'
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE path = 'clients');

-- =========================
-- ASSIGNED PAGES (CLIENT)
-- =========================
INSERT INTO assigned_pages (page_id, role)
SELECT p.id, 'client'
FROM pages p
WHERE p.path IN ('dashboard', 'appointments', 'book')
AND NOT EXISTS (
  SELECT 1 FROM assigned_pages ap 
  WHERE ap.page_id = p.id AND ap.role = 'client'
);

-- =========================
-- ASSIGNED PAGES (PROFESSIONAL)
-- =========================
INSERT INTO assigned_pages (page_id, role)
SELECT p.id, 'professional'
FROM pages p
WHERE p.path IN ('dashboard', 'p_appointments', 'availability', 'clients')
AND NOT EXISTS (
  SELECT 1 FROM assigned_pages ap 
  WHERE ap.page_id = p.id AND ap.role = 'professional'
);