// src/config/logger.js
const winston = require('winston');
const config = require('./env');

// Définir les niveaux de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Déterminer le niveau en fonction de l'environnement
const level = () => {
  const env = config.nodeEnv || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

// Format pour la coloration des logs (console)
const colorize = winston.format.colorize({ all: true });

// Format personnalisé
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...extra } = info;
    
    // Si des objets supplémentaires sont présents, les afficher
    const extraObj = Object.keys(extra).length 
      ? JSON.stringify(extra, null, 2) 
      : '';
    
    return `${timestamp} [${level}]: ${message} ${extraObj}`;
  })
);

// Options de transports
const transports = [
  // Console (avec couleurs)
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      format
    ),
  }),
  
  // Fichier d'erreurs
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format,
  }),
  
  // Fichier combiné
  new winston.transports.File({ 
    filename: 'logs/combined.log',
    format,
  }),
];

// Création du logger
const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
  exitOnError: false,
});

module.exports = logger;