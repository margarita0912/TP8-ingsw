package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv(env string) {
	var filename string
	switch env {
	case "prod":
		filename = ".env.prod"
	case "qa":
		filename = ".env.qa"
	default:
		filename = ".env.qa"
	}

	// Intentar cargar el archivo .env
	err := godotenv.Load(filename)
	if err != nil {
		// Solo advertir, no fallar - las variables pueden venir del sistema
		log.Printf("Advertencia: No se pudo cargar %s, usando variables de entorno del sistema: %v", filename, err)

		// Opcional: verificar que las variables críticas existan
		requiredVars := []string{"DB_HOST", "DB_NAME", "DB_USER", "DB_PASS", "DB_PORT", "PORT"}
		for _, v := range requiredVars {
			if os.Getenv(v) == "" {
				log.Fatalf("Variable de entorno requerida no encontrada: %s", v)
			}
		}
	} else {
		log.Printf("Archivo %s cargado exitosamente", filename)
	}
}
