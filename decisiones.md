# Decisiones Técnicas - TP8 Ingeniería de Software 3

## 1. Decisiones Arquitectónicas y Tecnológicas

### 1.1 Stack tecnológico

#### Backend (Go + Gin + GORM + JWT + MySQL/Railway)

- **Go:** binario estático, performance y concurrencia para APIs.
- **Gin:** router liviano con middlewares (CORS, auth).
- **GORM:** ORM maduro para MySQL (migraciones básicas).
- **JWT:** auth stateless.
- **MySQL (Railway):** relacional administrada, sin gestionar infraestructura.

#### Frontend (React 19 + TypeScript + Vite + Axios)

- **TS:** type-safety y mantenibilidad.
- **React 19:** ecosistema estable y componentes reutilizables.
- **Vite:** build rápido y DX.
- **Axios:** interceptores para JWT y encabezados.

### 1.2 Servicios cloud

#### Container Registry: GitHub Container Registry (GHCR)

- Integración nativa con GitHub Actions, versionado por tags, sin costo en público.
- Permisos por repo/owner.
- **Alternativas descartadas:** Docker Hub (límites), ECR/Artifact Registry (complejidad/costo).

#### Hosting: Render.com (backend y frontend)

- Despliegue directo desde imágenes GHCR, HTTPS automático, variables y logs integrados, free tier suficiente para TP.
- **Alternativas descartadas:** Heroku (sin free), Vercel/Netlify (solo FE), ECS/Cloud Run (complejidad/billing).

#### Base de datos: Railway (MySQL)

- MySQL administrado, backups automáticos, acceso externo sencillo.
- Un único schema `railway` para QA/PROD (diferenciación de ambientes en app; válido para TP).

### 1.3 QA vs PROD

**Estrategia:** mismo proveedor (Render), servicios separados por ambiente.

#### Diferenciación principal

| Aspecto | QA | PROD |
|---------|----|----|
| Backend URL | `https://tp8-back-qa.onrender.com` | `https://tp8-back-prod-svdk.onrender.com` |
| Frontend URL | `https://tp8-front-qa-i491.onrender.com` | `https://tp8-front-prod-tn48.onrender.com` |
| Tag de imagen | `:qa` | `:prod` |
| Build FE | `--mode qa` | `--mode production` |
| API base (FE) | `.env.qa` → QA | `.env.production` → PROD |
| GIN_MODE | `debug` | `release` |
| BD | MySQL-QA | MySQL-PROD |

### 1.4 Recursos por ambiente

- **Backend (QA/PROD idénticos para TP):** 0.5 vCPU, 512 MB RAM, 1 instancia, sleep tras inactividad, health check: `/productos`.
- **Frontend (QA/PROD):** static + CDN, build con Vite, HTTPS automático.

---

## 2. Implementación

### 2.1 Container Registry (GHCR)

**Imágenes:**
- `ghcr.io/margarita0912/tp8-ingsw-back`
- `ghcr.io/margarita0912/tp8-ingsw-front`

**Tags:** `:latest`, `:qa` y `:prod`.

**Autenticación:** `GITHUB_TOKEN` en Actions, PAT con `read:packages` en Render.

**Visibilidad:** públicas (coherente con free tier y despliegue desde Render).

**Evidencias (capturas):** `ghcr-packages.png`, `ghcr-tags.png`, `ghcr-manifest.png`.

### 2.2 Ambiente QA (Render)

**URLs:**
- Back: `https://tp8-back-qa.onrender.com`
- Front: `https://tp8-front-qa-i491.onrender.com`

**Variables backend (ejemplo):**
- `DB_HOST`/`PORT`/`NAME`/`USER`/`PASS`
- `PORT=10000`
- `GIN_MODE=debug`
- `APP_ENV=qa`
- `JWT_SECRET`
- `ALLOWED_ORIGINS=https://tp8-front-qa-i491.onrender.com`
- `RENDER=true`

**Frontend:** `VITE_API_URL=https://tp8-back-qa.onrender.com` (en `.env.qa`).

**Evidencias:** dashboard, logs, build FE/BE y deploy OK.

### 2.3 Ambiente PROD (Render)

**URLs:**
- Back: `https://tp8-back-prod-svdk.onrender.com`
- Front: `https://tp8-front-prod-tn48.onrender.com`

**Variables backend (ejemplo):**
- Igual que QA pero:
  - `GIN_MODE=release`
  - `APP_ENV=prod`
  - `ALLOWED_ORIGINS=https://tp8-front-prod-tn48.onrender.com`
  - JWT distinto

**Frontend:** `VITE_API_URL=https://tp8-back-prod-svdk.onrender.com` (en `.env.production`).

**CD:** webhook de Render disparado desde Actions; rollback manual desde dashboard.

**Evidencias:** deploy, logs, app en modo release.

### 2.4 Pipeline CI/CD (GitHub Actions)

**Stages:**

1. **test-back** (Go + cobertura)
2. **test-front** (TS typecheck, ESLint, Jest, build)
3. **build-push** (back y front, tags `:qa`/`:prod`/`:latest`)
4. **deploy-qa** (webhooks Render)
5. **approval gate** (opcional, para PROD)
6. **deploy-prod**
7. **summary** (imágenes y URLs resultantes)

**Secrets:** `GHCR_USER`, `GHCR_TOKEN`, `RENDER_*_HOOK`.

**Evidencias:** capturas por stage (overview, tests, build/push, deploy).

---

## 3. Análisis comparativo

### 3.1 QA vs PROD (resumen)

| Aspecto | QA | PROD | Justificación |
|---------|----|----|---------------|
| Servicio | Render Free | Render Free | Simplicidad y costo $0 para TP |
| CPU/RAM | 0.5 vCPU / 512 MB | 0.5 vCPU / 512 MB | Límite free tier; suficiente para demo |
| Instancias | 1 | 1 | Sin autoscaling en free tier |
| Deploy | automático | automático (+ gate opcional) | Mismo pipeline, gates para PROD |
| CORS | origen QA | origen PROD | Aislamiento por ambiente |
| Logs | debug | release | Ruido mínimo en PROD |
| Uptime | sleep | sleep | Free tier; en real, always-on |

**Ventajas del mismo servicio:** configuración repetible, menos complejidad, troubleshooting unificado.

**Desventajas:** límites free compartidos y mayor dependencia del proveedor.

### 3.2 Alternativas

- **Heroku:** sin free, más costo.
- **Vercel/Netlify:** óptimos para FE, requiere BE aparte.
- **AWS ECS/Cloud Run:** más escalables, mayor complejidad y billing.
- **Railway "todo":** buen DX pero créditos limitados.

### 3.3 Costos y optimización (síntesis)

**Actual:** $0 (Render FE/BE, GHCR, Actions público, Railway compartido).

**Productivo sugerido:** Starter/Standard en Render (always-on y autoscaling), DB con mayor plan, monitoreo (Sentry/APM).

**Optimización:** un solo BE multi-tenant, CDN agresivo, health checks dedicados.

### 3.4 Escalabilidad (síntesis)

**10× usuarios:** +instancias BE, plan DB superior, cache (Redis), métricas/alertas.

**Kubernetes cuando:** >5 servicios, >10 deploys/día, requerimientos multi-región o compliance.

**Mientras tanto:** Render con autoscaling y monitoreo es suficiente.

---

### URLs

- **QA Backend:** `https://tp8-back-qa.onrender.com`
- **QA Frontend:** `https://tp8-front-qa-i491.onrender.com`
- **PROD Backend:** `https://tp8-back-prod-svdk.onrender.com`
- **PROD Frontend:** `https://tp8-front-prod-tn48.onrender.com`
