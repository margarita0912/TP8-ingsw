package main

import (
	"fmt"
	"os"
	"strings"
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
		// Por defecto para desarrollo local
		allowedOrigins = "http://localhost:5173,http://localhost:3000"
	}

	// Convertir string separado por comas en slice
	origins := strings.Split(allowedOrigins, ",")

	r.Use(cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "X-Env"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	routes.Setup(r)

	// Usar el puerto de la variable de entorno
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}
