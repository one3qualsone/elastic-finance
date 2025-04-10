// backend/src/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config');

// Import routes
const financeRoutes = require('./routes/finance');
const educationalRoutes = require('./routes/educational');

const app = express();
const PORT = config.port; 

// Define CORS configuration
// In backend/src/index.js
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://elastic-finance.vercel.app',
      'https://valueinvesting.oneequalsone.uk',
      // Keep the pattern for development URLs
      /https:\/\/elastic-finance-[a-z0-9]+-mj-oneequalsones-projects\.vercel\.app/
    ];
    
    if (!origin || 
        allowedOrigins.includes(origin) || 
        (typeof allowedOrigins[2] === 'object' && allowedOrigins[2].test(origin))) {
      callback(null, true);
    } else {
      console.log(`Blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Apply CORS middleware with the defined options
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Other middleware
app.use(helmet()); // Security headers
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Logging

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per minute
  message: 'Too many requests, please try again later.'
});
app.use('/api/', apiLimiter);

// Routes
app.use('/api/finance', financeRoutes);
app.use('/api/educational-content', educationalRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Elastic Finance API is running!',
    environment: config.nodeEnv,
    corsOrigin: config.corsOrigin
  });
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.status(200).json({ 
    message: 'Elastic Finance API endpoints available:',
    endpoints: [
      '/api/finance',
      '/api/educational-content'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.nodeEnv === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`CORS origin: ${config.corsOrigin}`);
});

module.exports = app; 