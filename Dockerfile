# Build Stage
# Utiliser Node.js 18 ou une version supérieure
FROM node:18 AS builder 

WORKDIR /app

# Copier package.json + package-lock.json
COPY package*.json ./

# Installer les dépendances avec npm
RUN yarn install

# Copier le reste de l'application
COPY . .

# Lancer l'application Next.js en mode développement
CMD ["yarn", "run", "dev"]
