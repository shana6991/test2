// src/config/env.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  notion: {
    apiKey: process.env.NOTION_API_KEY,
    parentPageId: process.env.NOTION_PARENT_PAGE_ID,
    targetDatabaseId: process.env.NOTION_TARGET_DATABASE_ID,
  },
  
  claude: {
    apiKey: process.env.CLAUDE_API_KEY,
    model: process.env.CLAUDE_MODEL || 'claude-3-7-sonnet-20250219',
    temperature: parseFloat(process.env.CLAUDE_TEMPERATURE || '0.2'),
    maxRetries: parseInt(process.env.CLAUDE_MAX_RETRIES || '3'),
  },
  
  cache: {
    enabled: process.env.CACHE_ENABLED !== 'false',
    ttl: parseInt(process.env.CACHE_TTL || '3600'),
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
    max: parseInt(process.env.RATE_LIMIT_MAX || '10'),
  }
};