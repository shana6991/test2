// src/api/routes/utilsRoutes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { ValidationError } = require('../../utils/errorTypes');
const logger = require('../../config/logger');

const router = express.Router();

/**
 * @route GET /api/utils/health
 * @desc Vérification de santé du serveur
 * @access Public
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * @route GET /api/utils/config
 * @desc Obtient la configuration publique
 * @access Public
 */
router.get('/config', (req, res) => {
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
});

/**
 * @route POST /api/utils/validate-notion-token
 * @desc Valide un token Notion
 * @access Public
 */
router.post('/validate-notion-token', async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      throw new ValidationError('Token Notion requis');
    }
    
    // Cette route servirait à tester si un token Notion est valide
    // Dans une implémentation réelle, on interrogerait l'API Notion
    
    res.json({
      success: true,
      message: 'Token validé avec succès',
      valid: true
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/utils/logs
 * @desc Journalisation côté client
 * @access Public
 */
router.post('/logs', (req, res) => {
  const { level, message, context } = req.body;
  
  const validLevels = ['error', 'warn', 'info', 'debug'];
  const logLevel = validLevels.includes(level) ? level : 'info';
  
  // Journaliser un message provenant du client
  if (message) {
    logger[logLevel](`Client log [${logLevel}]: ${message}`, context || {});
  }
  
  res.json({ success: true });
});

/**
 * @route GET /api/utils/stats
 * @desc Statistiques d'utilisation de l'API
 * @access Public
 */
router.get('/stats', (req, res) => {
  // Cette route pourrait fournir des statistiques basiques sur l'utilisation
  // comme le nombre de templates générées, le temps moyen, etc.
  
  // Pour l'exemple, on renvoie des statistiques fictives
  res.json({
    success: true,
    stats: {
      totalGenerations: 0,
      averageGenerationTime: 0,
      cacheHitRate: 0,
      uptimeHours: Math.floor(process.uptime() / 3600)
    }
  });
});

module.exports = router;