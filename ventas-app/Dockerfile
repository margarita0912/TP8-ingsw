# ===== Stage 1: Build =====
FROM golang:1.24-alpine AS build
WORKDIR /app

# Copiar dependencias y descargarlas (usa cache)
COPY go.mod go.sum ./
RUN go mod download

# Copiar el resto del código
COPY . .

# Compilar binario
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w" -o ventas-app ./cmd/main.go

# ===== Stage 2: Runtime =====
FROM gcr.io/distroless/base-debian12
WORKDIR /app

# Copiar binario con permisos ejecutables y propiedad de nonroot
COPY --from=build /app/ventas-app /app/ventas-app
USER root
RUN chmod +x /app/ventas-app && chown 65532:65532 /app/ventas-app
USER nonroot:nonroot

EXPOSE 8080
ENTRYPOINT ["/app/ventas-app"]
