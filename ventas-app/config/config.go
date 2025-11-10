package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv(env string) {
	// En producción (Render), usar directamente las variables de entorno
	if os.Getenv("RENDER") == "true" {
		log.Println("Ejecutando en Render, usando variables de entorno")
		setDefaults()
		return
	}

	// Para desarrollo local, intentar cargar archivo .env según el entorno
	envFile := ".env"
	if env != "" {
		envFile = ".env." + env
	}

	if err := godotenv.Load(envFile); err != nil {
		log.Printf("No se encontró %s, intentando .env por defecto\n", envFile)
		// Intentar cargar .env por defecto si el específico no existe
		if err := godotenv.Load(); err != nil {
			log.Println("No se encontró archivo .env, usando variables de entorno del sistema")
		}
	}
}
