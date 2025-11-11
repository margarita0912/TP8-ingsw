# ====== Stage 1: deps & build ======
FROM node:20-alpine AS build
WORKDIR /app

# ARG para especificar el entorno (qa o production)
ARG BUILD_MODE=qa

# Instalar deps con cache
COPY package*.json ./
RUN npm ci

# Copiar el código y archivos de configuración
COPY . .

# Vite carga .env.qa o .env.production según BUILD_MODE
RUN npm run build -- --mode ${BUILD_MODE}

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
# Use JSON format for CMD to handle signals properly
CMD ["sh", "-c", "serve -s dist -l $PORT"]