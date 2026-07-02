require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Initialize Firebase Admin connection
require('./src/config/firebase');

// Import dedicated domain routers
const websiteRoutes = require('./src/routes/websiteRoutes');
const pwaRoutes = require('./src/routes/pwaRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

// ==========================================
// 1. GLOBAL MIDDLEWARES
// ==========================================

// Parse JSON request payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure dynamic CORS filtering across monorepo frontends
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server calls)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('CORS policy violation: Origin not permitted.'));
      }
    },
    credentials: true,
  })
);

// Request Logger
app.use((req, res, next) => {
  console.log(`📡 [API Request] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// 2. HEALTH CHECK ROUTE
// ==========================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 O.G. Agency Unified Backend API is active and running.',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 3. MOUNT DOMAIN ROUTERS
// ==========================================
app.use('/api/v1/website', websiteRoutes);
app.use('/api/v1/pwa', pwaRoutes);
app.use('/api/v1/admin', adminRoutes);

// ==========================================
// 4. GLOBAL ERROR / 404 HANDLERS
// ==========================================
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} does not exist on this API server.`,
  });
});

app.use((err, req, res, next) => {
  console.error('💥 [Unhandled API Exception]:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ==========================================
// 5. BOOTSTRAP EXPRESS SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║ 🚀 O.G. Agency Unified Node.js Backend Server Active             ║
║ 🌐 Port: ${PORT}                                                    ║
║ 🔗 Health Check: http://localhost:${PORT}/api/health                 ║
║                                                                  ║
║ Active Frontend Endpoints Mounted:                               ║
║ • Official Website API: http://localhost:${PORT}/api/v1/website      ║
║ • Customer PWA API:     http://localhost:${PORT}/api/v1/pwa          ║
║ • Admin Dashboard API:  http://localhost:${PORT}/api/v1/admin        ║
╚══════════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
