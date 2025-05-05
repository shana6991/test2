// src/services/cacheService.js
const redis = require('redis');
const NodeCache = require('node-cache');
const config = require('../config/env');
const logger = require('../config/logger');

class CacheService {
  constructor() {
    this.config = {
      enabled: config.cache.enabled,
      ttl: config.cache.ttl
    };
    
    if (!this.config.enabled) {
      logger.info('Service de cache désactivé');
      return;
    }
    
    // Mode Redis (production) ou NodeCache (développement)
    if (config.cache.url && config.nodeEnv === 'production') {
      logger.info(`Initialisation du cache Redis: ${config.cache.url}`);
      this.type = 'redis';
      
      this.client = redis.createClient({
        url: config.cache.url
      });
      
      this.client.on('error', (err) => {
        logger.error('Erreur Redis:', err);
      });
      
      this.client.connect().catch(err => {
        logger.error('Erreur de connexion Redis:', err);
        // Fallback en mémoire
        this.type = 'memory';
        this.memoryCache = new NodeCache({ stdTTL: this.config.ttl });
      });
    } else {
      logger.info('Initialisation du cache en mémoire');
      this.type = 'memory';
      this.memoryCache = new NodeCache({ stdTTL: this.config.ttl });
    }
  }
  
  /**
   * Récupère une valeur du cache
   * @param {string} key - Clé à rechercher
   * @returns {Promise<any>} - Valeur en cache ou null
   */
  async get(key) {
    if (!this.config.enabled) return null;
    
    try {
      if (this.type === 'redis') {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        const value = this.memoryCache.get(key);
        return value || null;
      }
    } catch (error) {
      logger.error(`Erreur lors de la récupération du cache pour ${key}:`, error);
      return null;
    }
  }
  
  /**
   * Définit une valeur dans le cache
   * @param {string} key - Clé de la valeur
   * @param {any} value - Valeur à mettre en cache
   * @param {number} ttl - Durée de vie en secondes
   * @returns {Promise<boolean>} - Succès de l'opération
   */
  async set(key, value, ttl = null) {
    if (!this.config.enabled) return false;
    
    const effectiveTtl = ttl || this.config.ttl;
    
    try {
      if (this.type === 'redis') {
        await this.client.set(key, JSON.stringify(value), {
          EX: effectiveTtl
        });
      } else {
        this.memoryCache.set(key, value, effectiveTtl);
      }
      
      return true;
    } catch (error) {
      logger.error(`Erreur lors de la mise en cache pour ${key}:`, error);
      return false;
    }
  }
  
  /**
   * Supprime une valeur du cache
   * @param {string} key - Clé à supprimer
   * @returns {Promise<boolean>} - Succès de l'opération
   */
  async del(key) {
    if (!this.config.enabled) return false;
    
    try {
      if (this.type === 'redis') {
        await this.client.del(key);
      } else {
        this.memoryCache.del(key);
      }
      
      return true;
    } catch (error) {
      logger.error(`Erreur lors de la suppression du cache pour ${key}:`, error);
      return false;
    }
  }
  
  /**
   * Vide le cache entièrement
   * @returns {Promise<boolean>} - Succès de l'opération
   */
  async flush() {
    if (!this.config.enabled) return false;
    
    try {
      if (this.type === 'redis') {
        await this.client.flushAll();
      } else {
        this.memoryCache.flushAll();
      }
      
      return true;
    } catch (error) {
      logger.error('Erreur lors du vidage du cache:', error);
      return false;
    }
  }
}

module.exports = new CacheService();