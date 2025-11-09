FROM golang:1.22-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./ 
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w" -o ventas-app ./cmd/main.go

FROM gcr.io/distroless/base-debian12
WORKDIR /app
COPY --from=build /app/ventas-app /app/ventas-app

# Copiá solo plantillas (sin secretos); Railway pondrá los valores reales por env
COPY --from=build /app/.env.qa /app/.env.qa
COPY --from=build /app/.env.prod /app/.env.prod
ENV PORT=8080
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/app/ventas-app"]