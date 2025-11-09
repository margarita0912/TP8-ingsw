# ===== Build =====
FROM golang:1.24-alpine AS build
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Compilar binario estático y marcarlo ejecutable
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w" -o /app/ventas-app ./cmd/main.go \
 && chmod 0755 /app/ventas-app

# ===== Runtime =====
FROM gcr.io/distroless/base-debian12
WORKDIR /app

# 👇 Ojo a --chmod y --chown: garantizan permisos para el usuario no root
COPY --from=build --chown=nonroot:nonroot --chmod=0755 /app/ventas-app /app/ventas-app

ENV PORT=8080
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/app/ventas-app"]
