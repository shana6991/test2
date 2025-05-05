# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm ci --only=production

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 8080

# Démarrer l'application
CMD ["node", "src/server.js"]