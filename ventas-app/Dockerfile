FROM golang:1.24-alpine AS build
WORKDIR /app

# Copiar archivos de dependencias
COPY go.mod go.sum ./

# Descargar dependencias
RUN go mod download

# Copiar el resto del código fuente
COPY . .

# Compilar
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w" -o ventas-app ./cmd/main.go

FROM gcr.io/distroless/base-debian12
WORKDIR /app

# Copiar binario
COPY --from=build /app/ventas-app /app/ventas-app

# Copiar plantillas de configuración
COPY --from=build /app/.env.* ./

ENV PORT=8080
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/app/ventas-app"]