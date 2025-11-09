# 1) Instalar deps con cache
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2) Build de producción
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Si usás Vite: asegurate que "build" genere /dist
RUN npm run build

# 3) Runtime mínimo para servir /dist
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/dist ./dist
# Render/Railway te dan $PORT. Por defecto 3000 si corrés local.
ENV PORT=3000
EXPOSE 3000
CMD ["serve","-s","dist","-l","${PORT}"]
