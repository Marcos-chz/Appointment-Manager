// Create table user

createTableUsers = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL,
  role VARCHAR(20) DEFAULT 'client',
  avatar VARCHAR(255) DEFAULT 'default.png'
);`

createTableAppointment = `
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  professional INT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULl,
  status VARCHAR(20) DEFAULT 'pending',
  message TEXT,
  user_id INT NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);`

const createTableAvailability = `
CREATE TABLE availability (
  id SERIAL PRIMARY KEY,
  professional_id INT NOT NULL,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=domingo, 6=sábado
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  FOREIGN KEY (professional_id) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (end_time > start_time)
);
`

const createTablePages = `
CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  path VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);
`

const createTableAsignedPages = `
CREATE TABLE IF NOT EXISTS assigned_pages (
  id SERIAL PRIMARY KEY,
  page_id INT NOT NULL,
  role VARCHAR(20) NOT NULL,

  FOREIGN KEY (page_id) REFERENCES pages(id)
    ON DELETE CASCADE
);
`


insertUsers = `
  INSERT INTO users (name, lastname, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *
`

insertAppointment = `
  INSERT INTO appointments (professional, date, time, message, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *
`

module.exports = {createTableUsers, insertUsers, createTableAppointment, insertAppointment, createTableAvailability}