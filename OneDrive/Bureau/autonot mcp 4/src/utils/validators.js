// src/utils/validators.js

/**
 * Valide un ID de page Notion
 * @param {string} id - ID à valider
 * @returns {boolean} - True si l'ID est valide
 */
exports.isValidNotionId = (id) => {
  // Les IDs Notion sont des UUIDs (32 caractères hexadécimaux + tirets)
  // ou des IDs courts (caractères alphanumériques)
  if (!id || typeof id !== 'string') return false;
  
  // Format UUID avec tirets
  const uuidRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  
  // Format UUID sans tirets
  const shortUuidRegex = /^[a-f0-9]{32}$/i;
  
  // Format ID court Notion
  const shortIdRegex = /^[a-z0-9]{2,}$/i;
  
  return uuidRegex.test(id) || shortUuidRegex.test(id) || shortIdRegex.test(id);
};

/**
 * Valide une URL
 * @param {string} url - URL à valider
 * @returns {boolean} - True si l'URL est valide
 */
exports.isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch (e) {
    return false;
  }
};

/**
 * Valide une couleur au format Notion
 * @param {string} color - Couleur à valider
 * @returns {boolean} - True si la couleur est valide
 */
exports.isValidNotionColor = (color) => {
  const validColors = [
    'default',
    'gray', 'brown', 'orange', 'yellow', 'green', 
    'blue', 'purple', 'pink', 'red',
    'gray_background', 'brown_background', 'orange_background', 
    'yellow_background', 'green_background', 'blue_background', 
    'purple_background', 'pink_background', 'red_background'
  ];
  
  return validColors.includes(color);
};

/**
 * Nettoie et valide un prompt utilisateur
 * @param {string} prompt - Prompt à valider
 * @returns {string|null} - Prompt nettoyé ou null si invalide
 */
exports.sanitizePrompt = (prompt) => {
  if (!prompt || typeof prompt !== 'string') return null;
  
  // Nettoyer les espaces superflus
  const cleaned = prompt.trim();
  
  // Rejeter les prompts trop courts ou trop longs
  if (cleaned.length < 5 || cleaned.length > 1000) return null;
  
  return cleaned;
};