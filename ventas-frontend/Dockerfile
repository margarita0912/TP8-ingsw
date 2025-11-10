# ====== Stage 1: deps & build ======
FROM node:20-alpine AS build
WORKDIR /app

# Instalar deps con cache
COPY package*.json ./
RUN npm ci

# Copiar el código y buildear (Vite genera /dist)
COPY . .
RUN npm run build

# ====== Stage 2: runtime (Alpine) ======
FROM node:20-alpine AS runner
WORKDIR /app

# Usuario no root
RUN addgroup -S web && adduser -S web -G web

# Instalar server estático
RUN npm i -g serve

# Copiar artefacto estático
COPY --from=build /app/dist /app/dist

# Railway/Render setean $PORT; por defecto 3000
ENV PORT=3000
EXPOSE 3000

USER web
# CAMBIO: Usar CMD con shell para que expanda $PORT
CMD serve -s dist -l $PORT