# Utilisez l'image officielle de Bun
FROM oven/bun:1

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers de votre projet
COPY package.json bun.lockb ./
COPY . .

# Installer les dépendances
RUN bun install --frozen-lockfile
RUN bun prisma generate

# Exposer le port de l'application
EXPOSE 3000

# Commande pour exécuter l'application
ENTRYPOINT ["bun", "run", "src/index.ts"]
