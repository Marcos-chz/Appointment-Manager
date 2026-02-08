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
const path = require('path');  // ← Asegúrate de tener esto
require('dotenv').config();
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 4000;

// CORS (igual que antes)
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://appointment-manager.vercel.app",
      /\.vercel\.app$/
    ];
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => 
      typeof allowed === 'string' 
        ? origin === allowed 
        : allowed.test(origin)
    )) {
      callback(null, true);
    } else {
      console.log('CORS bloqueado para origen:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.options('*', cors());
app.use(express.json());

// Usa path.join para rutas estáticas
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.status(200).json({ status: "API running" });
});

// Multer config
const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads", "avatars"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// CARGAR ROUTERS CON PATHS ABSOLUTOS
const routes = [
  { path: '/appointments', file: 'appointment' },
  { path: '/user', file: 'user' },
  { path: '/auth', file: 'auth' },
  { path: '/availability', file: 'availability' },
  { path: '/pages', file: 'pages' }
];

routes.forEach(route => {
  try {
    const router = require(path.join(__dirname, 'routes', route.file));
    app.use(route.path, router);
    console.log(`✅ ${route.file}Router montado en ${route.path}`);
  } catch (error) {
    console.error(`❌ Error cargando ${route.file}:`, error.message);
    throw error; // Falla rápido si hay error
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
  console.log(`📂 Directorio actual: ${__dirname}`);
});

module.exports = upload;