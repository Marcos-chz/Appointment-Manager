
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

const initializeDatabase = require('./init-database');

console.log('=== Starting server on Render ===');
console.log('Current directory:', __dirname);
console.log('Server port:', PORT);

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Load API routes with error handling
console.log('Loading API routes...');

// Auth routes
try {
  const authRouter = require(path.join(__dirname, 'routes', 'auth'));
  app.use('/auth', authRouter);
  console.log('✓ Auth router loaded successfully');
} catch (error) { 
  console.error('✗ Auth router error:', error.message); 
}

// Appointment routes
try {
  const appointmentRouter = require(path.join(__dirname, 'routes', 'appointment'));
  app.use('/appointments', appointmentRouter);
  console.log('✓ Appointment router loaded successfully');
} catch (error) { 
  console.error('✗ Appointment router error:', error.message); 
}

// User routes
try {
  const userRouter = require(path.join(__dirname, 'routes', 'user'));
  app.use('/user', userRouter);
  console.log('✓ User router loaded successfully');
} catch (error) { 
  console.error('✗ User router error:', error.message); 
}

// Availability routes
try {
  const availabilityRouter = require(path.join(__dirname, 'routes', 'availability'));
  app.use('/availability', availabilityRouter);
  console.log('✓ Availability router loaded successfully');
} catch (error) { 
  console.error('✗ Availability router error:', error.message); 
}

// Pages routes
try {
  const pagesController = require(path.join(__dirname, 'routes', 'pages'));
  app.use('/pages', pagesController);
  console.log('✓ Pages router loaded successfully');
} catch (error) { 
  console.error('✗ Pages router error:', error.message); 
}


initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('All routes have been loaded successfully');
});

module.exports = app;