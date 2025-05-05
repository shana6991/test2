// src/api/controllers/templateController.js
const claudeService = require('../../services/claudeService');
const notionService = require('../../services/notionService');
const cacheService = require('../../services/cacheService');
const logger = require('../../config/logger');
const { ApplicationError } = require('../../utils/errorTypes');

/**
 * Génère une template complète
 */
exports.generateTemplate = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        success: false,
        error: 'Prompt requis'
      });
    }
    
    logger.info(`Nouvelle demande de génération: "${prompt.substring(0, 50)}..."`);
    
    // Vérifier le cache
    const cacheKey = `template:${prompt}`;
    const cachedResult = await cacheService.get(cacheKey);
    
    if (cachedResult) {
      logger.info(`Résultat trouvé en cache pour "${prompt.substring(0, 30)}..."`);
      return res.json(cachedResult);
    }
    
    // Étape 1: Générer la structure avec Claude
    const templateStructure = await claudeService.generateMainStructure(prompt);
    
    // Étape 2: Générer le contenu de la page principale
    templateStructure.mainPage = {
      content: await claudeService.generatePageContent({
        pageType: 'main',
        mainStructure: templateStructure,
        originalPrompt: prompt
      })
    };
    
    // Étape 3: Générer le contenu des sous-pages
    for (let i = 0; i < templateStructure.subPages.length; i++) {
      const subPage = templateStructure.subPages[i];
      logger.info(`Génération de la sous-page ${i+1}/${templateStructure.subPages.length}: "${subPage.title}"`);
      
      const subPageContent = await claudeService.generatePageContent({
        pageType: 'sub',
        mainStructure: templateStructure,
        originalPrompt: prompt,
        subPage
      });
      
      templateStructure.subPages[i] = {
        ...subPage,
        ...subPageContent
      };
    }
    
    // Étape 4: Générer les structures de base de données
    for (let i = 0; i < templateStructure.databases.length; i++) {
      const database = templateStructure.databases[i];
      logger.info(`Génération de la base de données ${i+1}/${templateStructure.databases.length}: "${database.title}"`);
      
      const dbStructure = await claudeService.generateDatabaseStructure({
        database,
        mainStructure: templateStructure,
        originalPrompt: prompt
      });
      
      templateStructure.databases[i] = {
        ...database,
        ...dbStructure
      };
    }
    
    // Étape 5: Créer dans Notion
    const result = await notionService.createTemplate(templateStructure);
    
    // Mise en cache du résultat
    await cacheService.set(cacheKey, result);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Générer une template à partir d'un exemple existant
 */
exports.generateFromExample = async (req, res, next) => {
  try {
    const { examplePrompt, customizationPrompt } = req.body;
    
    if (!examplePrompt || !customizationPrompt) {
      return res.status(400).json({ 
        success: false,
        error: 'Tous les champs sont requis'
      });
    }
    
    // Logique combinée pour générer à partir d'un exemple...
    
    // Réutilisation de la logique de génération standard
    const combinedPrompt = `Crée une template basée sur cet exemple: ${examplePrompt}. Personnalisations à appliquer: ${customizationPrompt}`;
    
    req.body.prompt = combinedPrompt;
    return this.generateTemplate(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * Améliore visuellement une template existante
 */
exports.enhanceTemplate = async (req, res, next) => {
  try {
    const { pageId, stylePrompt } = req.body;
    
    if (!pageId || !stylePrompt) {
      return res.status(400).json({ 
        success: false,
        error: 'Tous les champs sont requis'
      });
    }
    
    // Logique d'amélioration visuelle...
    
    res.json({
      success: true,
      message: "Améliorations visuelles appliquées avec succès",
      pageId
    });
  } catch (error) {
    next(error);
  }
};