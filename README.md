# TP8 - Sistema de Ventas con CI/CD

Sistema de gestión de ventas con arquitectura cliente-servidor, implementando CI/CD completo con ambientes QA y Producción separados.

## Ambientes Deployados

### QA Environment
- **Backend:** https://tp8-back-qa.onrender.com
- **Frontend:** https://tp8-front-qa-i491.onrender.com

### Production Environment
- **Backend:** https://tp8-back-prod-svdk.onrender.com
- **Frontend:** https://tp8-front-prod-tn48.onrender.com

## Tecnologias usadas

### Backend
- **Lenguaje:** Go 1.22+
- **Framework:** Gin Web Framework
- **ORM:** GORM
- **Base de Datos:** MySQL (Railway)
- **Autenticación:** JWT (golang-jwt/jwt/v5)
- **CORS:** gin-contrib/cors

### Frontend
- **Framework:** React 19.1.1
- **Lenguaje:** TypeScript 5.9.3
- **Build Tool:** Vite 7.1.7
- **HTTP Client:** Axios 1.12.2
- **Routing:** React Router 7.9.4
- **Testing:** Jest 30.2.0 + React Testing Library
- **E2E:** Cypress 15.6.0

### DevOps & Infraestructura
- **CI/CD:** GitHub Actions
- **Container Registry:** GitHub Container Registry (GHCR)
- **Hosting:** Render.com (Frontend y Backend)
- **Database:** Railway MySQL
- **Containerización:** Docker (multi-stage builds)