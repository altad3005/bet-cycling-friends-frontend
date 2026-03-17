# Utilise Node 22 (la version la plus stable actuellement)
FROM node:22-alpine AS base

# Installation des dépendances
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Build du projet Next.js
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Désactive la télémétrie Next.js pendant le build
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Image finale pour l'exécution
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]