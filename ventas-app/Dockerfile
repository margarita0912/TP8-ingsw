# ===== Stage 1: Build =====
FROM golang:1.24-alpine AS build
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Compilar binario estático
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w" -o ventas-app ./cmd/main.go

# ===== Stage 2: Runtime (distroless) =====
FROM gcr.io/distroless/base-debian12
WORKDIR /app

# 👇 Fijamos permisos y propietario en el COPY (no hay /bin/sh en distroless)
COPY --from=build --chown=nonroot:nonroot --chmod=0755 /app/ventas-app /app/ventas-app

USER nonroot:nonroot
EXPOSE 8080
ENTRYPOINT ["/app/ventas-app"]
