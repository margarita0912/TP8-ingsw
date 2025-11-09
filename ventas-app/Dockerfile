# ===== Stage 1: Build =====
FROM golang:1.24-alpine AS build
WORKDIR /app

# deps con cache
COPY go.mod go.sum ./
RUN go mod download

# código
COPY . .

# binario estático (sin CGO) llamado ventas-app
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w" -o /app/ventas-app ./cmd/main.go

# ===== Stage 2: Runtime (Alpine) =====
FROM alpine:3.20
# crear usuario no root
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app

# copiar binario y dejarlo ejecutable, dueño = app
COPY --from=build /app/ventas-app /app/ventas-app
RUN chmod 0755 /app/ventas-app && chown app:app /app/ventas-app

ENV PORT=8080
EXPOSE 8080
USER app
ENTRYPOINT ["/app/ventas-app"]
