# FROM node:18.19.0


# # definition du repertoire de travail
# WORKDIR /app


# # copy
# COPY .. ..


# # installation du CLi
# RUN npm install -g @angular/cli@~17.3.0


# # installation des dependansces du projet
# RUN npm install


# # exposition du port utulise
# EXPOSE 4200
# # execution des conteneur
# CMD npm run start


# deuxieme proposition

# Étape 1 : Construction avec Node.js
FROM node:18.19.0 AS build

# Définition du répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copier le reste des fichiers source Angular dans le conteneur
COPY . .

# Construire l’application Angular en mode production
RUN npm run build --prod

# Étape 2 : Service avec Nginx
FROM nginx:alpine

# Copier les fichiers construits dans le répertoire de service de Nginx
COPY --from=build /app/dist/[nom_du_dossier_dist] /usr/share/nginx/html

# Exposer le port 80 pour Nginx
EXPOSE 80

# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
