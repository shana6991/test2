// src/services/claudeService.js
const { Anthropic } = require('@anthropic-ai/sdk');
const config = require('../config/env');
const logger = require('../config/logger');
const prompts = require('../templates/prompts');
const { ClaudeError } = require('../utils/errorTypes');

class ClaudeService {
  constructor() {
    this.client = new Anthropic({
      apiKey: config.claude.apiKey,
      defaultHeaders: { 'anthropic-version': '2023-06-01' }
    });
    
    this.config = {
      model: config.claude.model,
      temperature: config.claude.temperature,
      maxRetries: config.claude.maxRetries
    };
  }

  /**
   * Génère la structure principale du template
   * @param {string} prompt - Description utilisateur du template
   * @returns {Promise<Object>} - Structure du template au format JSON
   */
  async generateMainStructure(prompt) {
    logger.info(`Génération de structure pour: "${prompt.substring(0, 50)}..."`);
    
    const userPrompt = prompts.mainStructure.replace('{{USER_PROMPT}}', prompt);
    
    try {
      const response = await this._createMessageWithRetry({
        maxTokens: 3000,
        messages: [{ role: "user", content: userPrompt }]
      });
      
      return this._extractStructureFromResponse(response.content[0].text);
    } catch (error) {
      logger.error('Erreur génération structure:', error);
      throw new ClaudeError(`Erreur lors de la génération de la structure: ${error.message}`);
    }
  }
  
  /**
   * Génère le contenu d'une page
   * @param {Object} context - Contexte du template et de la page
   * @returns {Promise<Array>} - Contenu de la page au format JSON
   */
  async generatePageContent(context) {
    const { pageType, mainStructure, originalPrompt, subPage = null } = context;
    
    // Choisir le bon template de prompt selon le type de page
    const promptTemplate = pageType === 'main' 
      ? prompts.mainPageContent 
      : prompts.subPageContent;
    
    // Préparer le prompt avec le contexte
    const userPrompt = this._formatPromptWithContext(promptTemplate, {
      mainStructure,
      originalPrompt,
      subPage
    });
    
    try {
      const response = await this._createMessageWithRetry({
        maxTokens: 3000,
        messages: [{ role: "user", content: userPrompt }]
      });
      
      return this._extractContentFromResponse(response.content[0].text);
    } catch (error) {
      logger.error(`Erreur génération contenu de page ${pageType}:`, error);
      throw new ClaudeError(`Erreur lors de la génération du contenu: ${error.message}`);
    }
  }
  
  /**
   * Génère la structure d'une base de données
   * @param {Object} context - Contexte du template et de la base de données
   * @returns {Promise<Object>} - Structure de la base de données
   */
  async generateDatabaseStructure(context) {
    const { database, mainStructure, originalPrompt } = context;
    
    const userPrompt = this._formatPromptWithContext(prompts.databaseStructure, {
      database,
      mainStructure,
      originalPrompt
    });
    
    try {
      const response = await this._createMessageWithRetry({
        maxTokens: 3000,
        messages: [{ role: "user", content: userPrompt }]
      });
      
      return this._extractDatabaseFromResponse(response.content[0].text);
    } catch (error) {
      logger.error(`Erreur génération structure BDD ${database.title}:`, error);
      throw new ClaudeError(`Erreur lors de la génération de la base de données: ${error.message}`);
    }
  }
  
  /**
   * Méthode utilitaire pour appeler l'API Anthropic avec retry
   * @private
   */
  async _createMessageWithRetry(options) {
    const { maxTokens, messages } = options;
    const config = {
      model: this.config.model,
      max_tokens: maxTokens,
      temperature: this.config.temperature,
      messages
    };
    
    let lastError;
    
    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        return await this.client.messages.create(config);
      } catch (error) {
        lastError = error;
        
        // Si c'est une erreur recoverable (timeout, etc.)
        if (error.status >= 500 || error.status === 429) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          logger.warn(`Tentative ${attempt + 1}/${this.config.maxRetries} échouée, attente de ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // Si c'est une erreur non recoverable (auth, validation, etc.)
          throw error;
        }
      }
    }
    
    throw lastError;
  }
  
  /**
   * Formate un template de prompt avec le contexte fourni
   * @private
   */
  _formatPromptWithContext(template, context) {
    let result = template;
    
    // Remplacer toutes les variables du template par leurs valeurs
    Object.entries(context).forEach(([key, value]) => {
      if (typeof value === 'object') {
        result = result.replace(`{{${key.toUpperCase()}}}`, JSON.stringify(value, null, 2));
      } else {
        result = result.replace(`{{${key.toUpperCase()}}}`, value);
      }
    });
    
    return result;
  }
  
  /**
   * Extrait la structure JSON de la réponse de Claude
   * @private
   */
  _extractStructureFromResponse(text) {
    try {
      // Extraction de JSON
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                        text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
      
      throw new Error('Impossible d\'extraire un JSON valide de la réponse');
    } catch (error) {
      logger.error('Erreur extraction structure:', error);
      throw new ClaudeError(`Erreur lors de l'extraction de la structure: ${error.message}`);
    }
  }
  
  /**
   * Extrait le contenu de page de la réponse de Claude
   * @private
   */
  _extractContentFromResponse(text) {
    try {
      // Détection du format (JSON ou Markdown)
      if (text.includes('```json') || text.match(/\[\s*\{\s*"type"/)) {
        // Format JSON
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                          text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        
        if (jsonMatch) {
          const jsonStr = jsonMatch[1] || jsonMatch[0];
          return JSON.parse(jsonStr);
        }
      } else if (text.includes('FORMAT: MARKDOWN') || text.includes('# ')) {
        // Format Markdown
        // Nettoyage du texte pour ne garder que le markdown
        const markdownContent = text
          .replace('FORMAT: MARKDOWN', '')
          .replace(/```markdown\n([\s\S]*?)\n```/g, '$1')
          .trim();
          
        // Retourner en format brut, la conversion sera faite par le transformer
        return { format: 'markdown', content: markdownContent };
      }
      
      throw new Error('Format de réponse non reconnu');
    } catch (error) {
      logger.error('Erreur extraction contenu:', error);
      throw new ClaudeError(`Erreur lors de l'extraction du contenu: ${error.message}`);
    }
  }
  
  /**
   * Extrait la structure de base de données de la réponse de Claude
   * @private
   */
  _extractDatabaseFromResponse(text) {
    try {
      // Même logique que _extractContentFromResponse mais adaptée aux BDD
      // ...
    } catch (error) {
      logger.error('Erreur extraction structure BDD:', error);
      throw new ClaudeError(`Erreur lors de l'extraction de la structure de base de données: ${error.message}`);
    }
  }
}

module.exports = new ClaudeService();