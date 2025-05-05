// src/api/middleware/errorHandler.js
const logger = require('../../config/logger');
const { ApplicationError } = require('../../utils/errorTypes');

/**
 * Middleware de gestion d'erreurs
 */
module.exports = (err, req, res, next) => {
  // Journaliser l'erreur
  logger.error(`${err.name}: ${err.message}`);
  if (err.stack) logger.debug(err.stack);
  
  // Déterminer le statut et le message
  const status = err instanceof ApplicationError ? err.status : 500;
  const message = err.message || 'Une erreur est survenue';
  
  // Détails supplémentaires en développement
  const details = process.env.NODE_ENV === 'development' 
    ? { stack: err.stack }
    : {};
  
  // Envoyer la réponse
  res.status(status).json({
    success: false,
    error: message,
    ...details
  });
};