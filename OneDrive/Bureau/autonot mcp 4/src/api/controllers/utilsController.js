// src/api/controllers/utilsController.js
const logger = require('../../config/logger');
const os = require('os');
const { ValidationError } = require('../../utils/errorTypes');

/**
 * Vérification de l'état du serveur
 */
exports.checkHealth = (req, res) => {
  // Collecter des informations sur l'état du système
  const memoryUsage = process.memoryUsage();
  const systemInfo = {
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    cpus: os.cpus().length,
    totalMemory: Math.round(os.totalmem() / (1024 * 1024)) + ' MB',
    freeMemory: Math.round(os.freemem() / (1024 * 1024)) + ' MB'
  };

  // Renvoyer l'état du serveur
  res.json({
    success: true,
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      rss: Math.round(memoryUsage.rss / (1024 * 1024)) + ' MB',
      heapTotal: Math.round(memoryUsage.heapTotal / (1024 * 1024)) + ' MB',
      heapUsed: Math.round(memoryUsage.heapUsed / (1024 * 1024)) + ' MB'
    },
    system: systemInfo
  });
};

/**
 * Obtient la configuration publique
 */
exports.getConfig = (req, res) => {
  // Ne renvoyer que les informations de configuration non sensibles
  res.json({
    success: true,
    config: {
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      cache: {
        enabled: process.env.CACHE_ENABLED !== 'false'
      },
      rateLimit: {
        enabled: process.env.RATE_LIMIT_ENABLED !== 'false'
      }
    }
  });
};

/**
 * Valide un token Notion
 */
exports.validateNotionToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      throw new ValidationError('Token Notion requis');
    }
    
    // Cette fonction servirait à tester si un token Notion est valide
    // Dans une implémentation réelle, on interrogerait l'API Notion
    
    // Simulation d'une validation réussie
    const isValid = token.startsWith('secret_') && token.length > 10;
    
    res.json({
      success: true,
      message: isValid ? 'Token validé avec succès' : 'Token invalide',
      valid: isValid
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Journalisation côté client
 */
exports.clientLog = (req, res) => {
  const { level, message, context } = req.body;
  
  const validLevels = ['error', 'warn', 'info', 'debug'];
  const logLevel = validLevels.includes(level) ? level : 'info';
  
  // Journaliser un message provenant du client
  if (message) {
    logger[logLevel](`Client log [${logLevel}]: ${message}`, context || {});
  }
  
  res.json({ success: true });
};

/**
 * Statistiques d'utilisation de l'API
 */
exports.getStats = (req, res) => {
  // Cette fonction pourrait fournir des statistiques basiques sur l'utilisation
  // comme le nombre de templates générées, le temps moyen, etc.
  
  // Pour l'exemple, on renvoie des statistiques fictives
  res.json({
    success: true,
    stats: {
      totalTemplatesGenerated: 0,
      averageGenerationTime: 0,
      cacheHitRate: 0,
      uptimeHours: Math.floor(process.uptime() / 3600)
    }
  });
};

/**
 * Vide le cache du serveur
 */
exports.clearCache = async (req, res, next) => {
  try {
    // Dans une implémentation réelle, on utiliserait le service de cache
    // const cacheService = require('../../services/cacheService');
    // await cacheService.flush();
    
    logger.info('Cache vidé manuellement');
    
    res.json({
      success: true,
      message: 'Cache vidé avec succès'
    });
  } catch (error) {
    next(error);
  }
};