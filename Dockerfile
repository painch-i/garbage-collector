# Utiliser l'image officielle de Bun
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Étape d'installation des dépendances
FROM base AS install
COPY package.json bun.lockb /temp/dev/
# Installer les modules
RUN cd /temp/dev && bun install --frozen-lockfile

# Générer le client Prisma
FROM install AS generate
COPY prisma/ /temp/dev/prisma
RUN cd /temp/dev && bun prisma generate

# Vérifier que le client Prisma a été généré
RUN ls -la /temp/dev/node_modules/.prisma/

# Étape de production
FROM base AS production
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copier le client Prisma généré dans l'étape de production
COPY --from=generate /temp/dev/node_modules/.prisma/ /temp/prod/node_modules/.prisma/

# Copier les autres modules de production
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Configuration de l'environnement
ENV NODE_ENV=production

# Exécuter l'application
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "sh" ]
