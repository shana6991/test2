// src/api/routes/templateRoutes.js
const express = require('express');
const templateController = require('../controllers/templateController');
const { validateGenerateRequest } = require('../middleware/validator');

const router = express.Router();

/**
 * @route POST /api/templates/generate
 * @desc Génère une nouvelle template Notion
 * @access Public
 */
router.post('/generate', validateGenerateRequest, templateController.generateTemplate);

/**
 * @route POST /api/templates/generate-from-example
 * @desc Génère une template basée sur un exemple
 * @access Public
 */
router.post('/generate-from-example', templateController.generateFromExample);

/**
 * @route POST /api/templates/enhance
 * @desc Améliore visuellement une template existante
 * @access Public
 */
router.post('/enhance', templateController.enhanceTemplate);

/**
 * @route GET /api/templates/presets
 * @desc Récupère la liste des templates prédéfinies
 * @access Public
 */
router.get('/presets', templateController.getPresets);

module.exports = router;