// src/api/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const config = require('../../config/env');

/**
 * Middleware de limitation de taux pour l'API
 */
exports.apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // Fenêtre de temps (défaut: 1 minute)
  max: config.rateLimit.max, // Nombre maximum de requêtes pendant la fenêtre
  standardHeaders: true, // Renvoie les en-têtes Rate-Limit-* standard
  legacyHeaders: false, // Désactive les en-têtes X-RateLimit-*
  message: {
    success: false,
    error: 'Trop de requêtes, veuillez réessayer plus tard'
  },
  skip: (req) => config.nodeEnv === 'development' || !config.rateLimit.enabled,
});

/**
 * Middleware de limitation plus stricte pour la génération de templates
 */
exports.templateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 requêtes par 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Limite de génération de templates atteinte. Veuillez réessayer dans quelques minutes.'
  },
  skip: (req) => config.nodeEnv === 'development' || !config.rateLimit.enabled,
  keyGenerator: (req) => req.ip, // Utilise l'IP comme identifiant
});