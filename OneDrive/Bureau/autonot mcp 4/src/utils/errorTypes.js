// src/utils/errorTypes.js
class ApplicationError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'ApplicationError';
    this.status = status;
  }
}

class ClaudeError extends ApplicationError {
  constructor(message) {
    super(`Erreur Claude: ${message}`, 500);
    this.name = 'ClaudeError';
  }
}

class NotionError extends ApplicationError {
  constructor(message) {
    super(`Erreur Notion: ${message}`, 500);
    this.name = 'NotionError';
  }
}

class TransformerError extends ApplicationError {
  constructor(message) {
    super(`Erreur de transformation: ${message}`, 500);
    this.name = 'TransformerError';
  }
}

class ValidationError extends ApplicationError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

module.exports = {
  ApplicationError,
  ClaudeError,
  NotionError,
  TransformerError,
  ValidationError
};