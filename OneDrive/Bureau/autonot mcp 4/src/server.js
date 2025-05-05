// src/server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const config = require('./config/env');
const logger = require('./config/logger');
const errorHandler = require('./api/middleware/errorHandler');

// Routes
const templateRoutes = require('./api/routes/templateRoutes');
const utilsRoutes = require('./api/routes/utilsRoutes');

// Initialisation
const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(cors());

// Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
if (config.rateLimit.enabled) {
  app.use(
    rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
      message: 'Trop de requêtes, veuillez réessayer plus tard'
    })
  );
}

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Routes API
app.use('/api/templates', templateRoutes);
app.use('/api/utils', utilsRoutes);

// Route principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Middleware d'erreur
app.use(errorHandler);

// Démarrage du serveur
const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`🚀 Serveur MCP démarré sur le port ${PORT}`);
  logger.info(`📝 Environnement: ${config.nodeEnv}`);
  logger.info(`🌐 URL: http://localhost:${PORT}`);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  logger.error('Erreur non gérée:', err);
});

module.exports = app;