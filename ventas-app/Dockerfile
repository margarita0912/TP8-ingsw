# ---- Build stage ----
FROM golang:1.24 AS builder
WORKDIR /src

# Instalar dependencias
COPY go.mod go.sum ./
RUN go mod download

# Copiar código fuente
COPY . .

# Compilar binario estático
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w" \
    -o /app/server ./cmd/main.go

# ---- Run stage ----
FROM gcr.io/distroless/base-debian12
WORKDIR /app

# Copiar el binario compilado
COPY --from=builder /app/server /app/server

# Configuración de runtime
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/app/server"]
