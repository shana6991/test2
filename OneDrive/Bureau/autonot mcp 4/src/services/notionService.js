// src/services/notionService.js
const { Client } = require('@notionhq/client');
const config = require('../config/env');
const logger = require('../config/logger');
const { NotionError } = require('../utils/errorTypes');
const transformerService = require('./transformerService');

class NotionService {
  constructor() {
    this.client = new Client({ auth: config.notion.apiKey });
  }

  /**
   * Crée un template complet dans Notion
   * @param {Object} template - Structure complète du template
   * @returns {Promise<Object>} - Informations sur le template créé
   */
  async createTemplate(template) {
    try {
      logger.info(`Création du template "${template.title}" dans Notion`);
      
      // 1. Créer la page principale
      const mainPage = await this.createMainPage(template);
      
      // 2. Créer les sous-pages
      for (const subPage of template.subPages) {
        await this.createSubPage(subPage, mainPage.id);
      }
      
      // 3. Créer les bases de données
      for (const database of template.databases) {
        await this.createDatabase(database, mainPage.id);
      }
      
      return {
        success: true,
        id: mainPage.id,
        url: `https://notion.so/${mainPage.id.replace(/-/g, '')}`,
        title: template.title
      };
    } catch (error) {
      logger.error('Erreur création template:', error);
      throw new NotionError(`Erreur lors de la création du template: ${error.message}`);
    }
  }
  
  /**
   * Crée la page principale dans Notion
   * @param {Object} template - Structure du template
   * @returns {Promise<Object>} - Page Notion créée
   */
  async createMainPage(template) {
    logger.info(`Création de la page principale: "${template.title}"`);
    
    try {
      // Transformer les blocs de contenu en format Notion
      const transformedBlocks = transformerService.transformContentToBlocks(
        template.mainPage.content, 
        template.colorTheme
      );
      
      // Déterminer où créer la page
      let parent;
      if (config.notion.parentPageId) {
        parent = { page_id: config.notion.parentPageId };
      } else if (config.notion.targetDatabaseId) {
        parent = { database_id: config.notion.targetDatabaseId };
      } else {
        throw new NotionError("Aucun ID parent ou base de données cible spécifié");
      }
      
      // Configurer les propriétés de la page
      const pageProperties = {
        parent,
        icon: {
          type: "emoji",
          emoji: template.icon || "📄"
        },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: template.title
                }
              }
            ]
          }
        },
        children: transformedBlocks.slice(0, 90) // Limite à 90 blocs pour l'appel initial
      };
      
      // Ajouter une couleur de couverture si spécifiée
      if (template.coverImage) {
        // Logique de gestion de la couverture...
        if (template.coverImage.startsWith('gradient')) {
          pageProperties.cover = {
            type: 'external',
            external: {
              url: `https://www.notion.so/images/page-cover/gradients_${Math.floor(Math.random() * 10) + 1}.png`
            }
          };
        } else if (this._validateImageUrl(template.coverImage)) {
          pageProperties.cover = {
            type: 'external',
            external: {
              url: template.coverImage
            }
          };
        }
      }
      
      // Créer la page
      const response = await this._withNotionRetry(async () => {
        return await this.client.pages.create(pageProperties);
      });
      
      logger.info(`Page principale créée avec ID: ${response.id}`);
      
      // S'il y a plus de 90 blocs, ajouter les blocs restants en groupes
      if (transformedBlocks.length > 90) {
        await this._addRemainingBlocks(response.id, transformedBlocks);
      }
      
      return response;
    } catch (error) {
      logger.error(`Erreur lors de la création de la page principale:`, error);
      throw new NotionError(`Erreur lors de la création de la page principale: ${error.message}`);
    }
  }
  
  /**
   * Crée une sous-page
   * @param {Object} subPage - Structure de la sous-page
   * @param {string} parentId - ID de la page parente
   * @returns {Promise<Object>} - Sous-page créée
   */
  async createSubPage(subPage, parentId) {
    logger.info(`Création de la sous-page: "${subPage.title}"`);
    
    try {
      // Implémentation similaire à createMainPage mais adaptée aux sous-pages
      // ...
    } catch (error) {
      logger.error(`Erreur lors de la création de la sous-page:`, error);
      throw new NotionError(`Erreur lors de la création de la sous-page: ${error.message}`);
    }
  }
  
  /**
   * Crée une base de données dans Notion
   * @param {Object} database - Structure de la base de données
   * @param {string} parentId - ID de la page parente
   * @returns {Promise<Object>} - Base de données créée
   */
  async createDatabase(database, parentId) {
    logger.info(`Création de la base de données: "${database.title}"`);
    
    try {
      // Implémentation de la création de base de données
      // ...
    } catch (error) {
      logger.error(`Erreur lors de la création de la base de données:`, error);
      throw new NotionError(`Erreur lors de la création de la base de données: ${error.message}`);
    }
  }
  
  /**
   * Ajoute des blocs à une page avec gestion des limites
   * @private
   */
  async _addRemainingBlocks(pageId, blocks) {
    const remainingBlocks = blocks.slice(90);
    
    logger.info(`Ajout de ${Math.ceil(remainingBlocks.length / 90)} groupes de blocs supplémentaires`);
    
    for (let i = 0; i < remainingBlocks.length; i += 90) {
      const chunk = remainingBlocks.slice(i, i + 90);
      
      await this._withNotionRetry(async () => {
        await this.client.blocks.children.append({
          block_id: pageId,
          children: chunk
        });
      });
      
      // Pause pour éviter les rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    logger.info(`Tous les blocs ajoutés avec succès`);
  }
  
  /**
   * Retry pour les opérations Notion
   * @private
   */
  async _withNotionRetry(operation, maxRetries = 5) {
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Gestion spécifique des erreurs Notion
        if (error.status === 409) {
          // Erreur de conflit, attendre plus longtemps
          const waitTime = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          logger.warn(`Conflit Notion (409), attente de ${waitTime}ms avant tentative ${attempt + 1}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else if (error.status === 429) {
          // Rate limit
          const retryAfter = error.headers?.['retry-after'] ? 
            parseInt(error.headers['retry-after']) * 1000 :
            Math.pow(2, attempt) * 2000;
            
          logger.warn(`Rate limit Notion (429), attente de ${retryAfter}ms avant tentative ${attempt + 1}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, retryAfter));
        } else {
          // Pour les autres types d'erreurs, ne pas réessayer
          throw error;
        }
      }
    }
    
    throw lastError;
  }
  
  /**
   * Valide une URL d'image
   * @private
   */
  _validateImageUrl(url) {
    if (!url) return false;
    
    try {
      const parsedUrl = new URL(url);
      return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch (e) {
      return false;
    }
  }
}

module.exports = new NotionService();