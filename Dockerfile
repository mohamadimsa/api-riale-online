# test sur du node js version 16
FROM node:17.0.0-slim

# Création du path root de notre application
WORKDIR /usr/src/app

# Copie des package.json, nécéssaire a l'installation des dépendances.
COPY package*.json ./

# lancement de l'installation.
RUN yarn install --include=dev

# If you are building your code for production
# RUN npm ci --only=production
#Build app source Files
COPY . .

# GENERATE DB CLIENT
RUN npx prisma generate

EXPOSE 7001

CMD [ "npm", "start" ]