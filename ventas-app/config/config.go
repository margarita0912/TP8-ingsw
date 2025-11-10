package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv(env string) {
	// Si estamos en Render, usar solo variables de entorno
	if os.Getenv("RENDER") == "true" {
		log.Println("Ejecutando en Render, usando variables de entorno del sistema")
		setDefaults()
		validateEnv()
		return
	}

	// Para desarrollo local, intentar cargar el archivo .env apropiado
	var filename string
	switch env {
	case "prod":
		filename = ".env.prod"
	case "qa":
		filename = ".env.qa"
	default:
		filename = ".env"
	}

	if err := godotenv.Load(filename); err != nil {
		log.Printf("Nota: No se pudo cargar %s, intentando .env por defecto", filename)
		// Intentar cargar .env por defecto si el específico no existe
		if err := godotenv.Load(); err != nil {
			log.Println("Usando variables de entorno del sistema")
		}
	}

	setDefaults()
	validateEnv()
}

// setDefaults establece valores por defecto para variables críticas
func setDefaults() {
	defaults := map[string]string{
		"PORT":     "8080",
		"DB_HOST": "localhost",
		"DB_PORT": "3306",
		"DB_NAME": "ventas",
	}

	for key, value := range defaults {
		if os.Getenv(key) == "" {
			os.Setenv(key, value)
		}
	}
}

// validateEnv verifica que las variables críticas tengan valor
func validateEnv() {
	// Variables que deben estar definidas en producción
	requiredVars := []string{"DB_USER", "DB_PASS"}
	
	// Si estamos en Render, necesitamos todas las variables
	if os.Getenv("RENDER") == "true" {
		requiredVars = append(requiredVars, []string{
			"DB_HOST",
			"DB_NAME",
			"DB_PORT",
		}...)
	}

	missingVars := []string{}
	for _, v := range requiredVars {
		if os.Getenv(v) == "" {
			missingVars = append(missingVars, v)
		}
	}

	if len(missingVars) > 0 {
		log.Printf("❌ Error: Las siguientes variables de entorno son requeridas: %v", missingVars)
		os.Exit(1)
	}
}
