// src/utils/responseFormatter.js

/**
 * Formate une réponse réussie
 * @param {Object} data - Données à renvoyer
 * @param {string} message - Message de succès
 * @returns {Object} - Réponse formatée
 */
exports.success = (data = null, message = 'Opération réussie') => {
  return {
    success: true,
    message,
    ...(data && { data })
  };
};

/**
 * Formate une réponse d'erreur
 * @param {string} message - Message d'erreur
 * @param {number} status - Code d'état HTTP
 * @param {Object} details - Détails supplémentaires
 * @returns {Object} - Réponse formatée
 */
exports.error = (message = 'Une erreur est survenue', status = 500, details = null) => {
  return {
    success: false,
    error: message,
    status,
    ...(details && { details })
  };
};

/**
 * Formate une réponse pour la génération de template
 * @param {Object} template - Informations sur la template générée
 * @returns {Object} - Réponse formatée
 */
exports.templateResponse = (template) => {
  return {
    success: true,
    message: 'Template générée avec succès',
    template: {
      id: template.id,
      url: template.url,
      title: template.title
    }
  };
};

/**
 * Formate une pagination
 * @param {Array} data - Données paginées
 * @param {number} page - Page actuelle
 * @param {number} limit - Nombre d'éléments par page
 * @param {number} total - Nombre total d'éléments
 * @returns {Object} - Réponse formatée avec pagination
 */
exports.paginate = (data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};