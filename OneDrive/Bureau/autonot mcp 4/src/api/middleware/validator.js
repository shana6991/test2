// src/api/middleware/validator.js
const { ValidationError } = require('../../utils/errorTypes');

/**
 * Valide les requêtes de génération de template
 */
exports.validateGenerateRequest = (req, res, next) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return next(new ValidationError('Un prompt est requis pour générer une template'));
  }
  
  if (typeof prompt !== 'string') {
    return next(new ValidationError('Le prompt doit être une chaîne de caractères'));
  }
  
  if (prompt.trim().length < 5) {
    return next(new ValidationError('Le prompt doit contenir au moins 5 caractères'));
  }
  
  if (prompt.trim().length > 1000) {
    return next(new ValidationError('Le prompt ne doit pas dépasser 1000 caractères'));
  }
  
  next();
};

/**
 * Valide les requêtes d'amélioration de template
 */
exports.validateEnhanceRequest = (req, res, next) => {
  const { pageId, stylePrompt } = req.body;
  
  if (!pageId) {
    return next(new ValidationError('L\'ID de la page Notion est requis'));
  }
  
  if (!stylePrompt) {
    return next(new ValidationError('Un prompt de style est requis'));
  }
  
  if (typeof pageId !== 'string' || !pageId.match(/^[a-f0-9-]+$/)) {
    return next(new ValidationError('L\'ID de page Notion doit être une chaîne hexadécimale valide'));
  }
  
  next();
};

/**
 * Valide les requêtes basées sur un exemple
 */
exports.validateExampleRequest = (req, res, next) => {
  const { examplePrompt, customizationPrompt } = req.body;
  
  if (!examplePrompt || !customizationPrompt) {
    return next(new ValidationError('Un prompt d\'exemple et un prompt de personnalisation sont requis'));
  }
  
  if (typeof examplePrompt !== 'string' || typeof customizationPrompt !== 'string') {
    return next(new ValidationError('Les prompts doivent être des chaînes de caractères'));
  }
  
  next();
};