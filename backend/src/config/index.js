const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  cacheTtl: parseInt(process.env.CACHE_TTL || '900', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'https://elasticfinancestorage.z6.web.core.windows.net',
  docsPath: path.resolve(__dirname, '../../../docs')
};