const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const chatRoutes = require('./routes/chat');
const { loadEmbeddings } = require('./rag/retrieve');

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed origin or local dev ports
    if (
      origin === allowedOrigin ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:')
    ) {
      return callback(null, true);
    }
    
    return callback(null, true); // Permissive in dev, can restrict in production
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'og-agency-ai-bot',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/chat', chatRoutes);

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize in-memory embeddings on startup
loadEmbeddings();

// Start Server
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 O.G. Agency AI Bot microservice running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/api/chat`);
  console.log(`🌐 Allowed Origin: ${allowedOrigin}`);
  console.log(`========================================`);
});
