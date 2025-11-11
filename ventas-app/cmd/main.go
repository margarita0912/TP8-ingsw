package main

import (
	"fmt"
	"os"
	"strings"
	"time"
	"ventas-app/config"
	"ventas-app/database"
	"ventas-app/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	env := os.Getenv("APP_ENV")
	config.LoadEnv("qa")

	database.ConnectAll()

	r := gin.Default()
	fmt.Println("Conexión establecida para QA y PROD", env)

	// Configuración de CORS dinámica
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	if allowedOrigins == "" {
		allowedOrigins = "http://localhost:5173,http://localhost:3000"
	}

	// Trim spaces from each origin
	originsRaw := strings.Split(allowedOrigins, ",")
	var origins []string
	for _, origin := range originsRaw {
		trimmed := strings.TrimSpace(origin)
		if trimmed != "" {
			origins = append(origins, trimmed)
		}
	}

	corsConfig := cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "X-Env"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}

	r.Use(cors.New(corsConfig))

	routes.Setup(r)

	// Usar el puerto de la variable de entorno
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}
