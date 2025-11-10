package database

import (
	"fmt"
	"log"
	"os"
	"ventas-app/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DBs = make(map[string]*gorm.DB)

// ConnectAll carga las conexiones a QA y PROD desde los archivos .env o variables del sistema
func ConnectAll() {
	// Intentar cargar .env.qa, si no existe usar variables del sistema
	envQA, err := godotenv.Read(".env.qa")
	if err != nil {
		log.Println("⚠️ Advertencia: No se pudo cargar .env.qa, usando variables del sistema")
		// Cargar desde variables de entorno del sistema
		envQA = map[string]string{
			"DB_HOST": os.Getenv("DB_HOST"),
			"DB_USER": os.Getenv("DB_USER"),
			"DB_PASS": os.Getenv("DB_PASS"),
			"DB_PORT": os.Getenv("DB_PORT"),
			"DB_NAME": os.Getenv("DB_NAME"),
		}
	}
	DBs["qa"] = connectFromMap(envQA)

	// Intentar cargar .env.prod, si no existe usar variables del sistema
	envProd, err := godotenv.Read(".env.prod")
	if err != nil {
		log.Println("⚠️ Advertencia: No se pudo cargar .env.prod, usando variables del sistema")
		// Cargar desde variables de entorno del sistema
		envProd = map[string]string{
			"DB_HOST": os.Getenv("DB_HOST"),
			"DB_USER": os.Getenv("DB_USER"),
			"DB_PASS": os.Getenv("DB_PASS"),
			"DB_PORT": os.Getenv("DB_PORT"),
			"DB_NAME": os.Getenv("DB_NAME"),
		}
	}
	DBs["prod"] = connectFromMap(envProd)

	fmt.Println("✅ Conexiones inicializadas:")
	for key, db := range DBs {
		if db != nil {
			fmt.Println("✔️", key, "conectado")
		} else {
			fmt.Println("❌", key, "no conectado")
		}
	}
}

func connectFromMap(env map[string]string) *gorm.DB {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		env["DB_USER"],
		env["DB_PASS"],
		env["DB_HOST"],
		env["DB_PORT"],
		env["DB_NAME"],
	)

	fmt.Printf("🔗 Conectando a %s (%s:%s)\n", env["DB_NAME"], env["DB_HOST"], env["DB_PORT"])

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("❌ Error al conectar a %s: %v", env["DB_NAME"], err)
	}

	db.AutoMigrate(&models.Usuario{}, &models.Producto{}, &models.Compra{}, &models.Venta{})
	return db
}
