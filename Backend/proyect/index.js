// const express = require('express');
// const cors = require('cors');
// require('dotenv').config()
// const path = require('path')
// const multer = require("multer");

// const app = express();
// const PORT = process.env.PORT || 4000;

// app.use(cors({
//   origin: function (origin, callback) {

//     const allowedOrigins = [
//       "http://localhost:5173",
//       "http://localhost:3000",
//       "https://appointment-manager.vercel.app",
//       /\.vercel\.app$/  
//     ];
    

//     if (!origin) return callback(null, true);
    
//     if (
//       allowedOrigins.some(allowed => 
//         typeof allowed === 'string' 
//           ? origin === allowed 
//           : allowed.test(origin)
//       )
//     ) {
//       callback(null, true);
//     } else {
//       console.log('CORS bloqueado para origen:', origin);
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//   credentials: true,
//   exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"],
//   maxAge: 86400 
// }));


// app.options('*', cors());

// app.use(express.json());

// app.use(
//   "/uploads",
//   express.static(path.join(__dirname, "uploads"))
// );

// app.get("/", (req, res) => {
//   res.status(200).json({ status: "API running", cors: "enabled" });
// });

// const storage = multer.diskStorage({
//   destination: "uploads/avatars",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// });

// const upload = multer({ storage });

// const appointmentRouter = require('./routes/appointment');
// const userRouter = require('./routes/user')
// const authRouter = require('./routes/auth');
// const availabilityRouter = require('./routes/availability')
// const pagesController = require('./routes/pages')

// app.use('/appointments', appointmentRouter); 
// app.use('/user', userRouter)
// app.use('/auth', authRouter); 
// app.use('/availability', availabilityRouter)
// app.use('/pages', pagesController)

// app.listen(PORT, () => {
//   console.log(`Server running at port ${PORT}`);
//   console.log('CORS configurado para: localhost, vercel.app y todos los subdominios de Vercel');
// });

// module.exports = upload;



const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('All routes have been loaded successfully');
});

module.exports = app;