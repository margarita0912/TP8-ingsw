package database

import (
	"fmt"
	"log"
	"os"
	"ventas-app/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() *gorm.DB {
	usuario := os.Getenv("DB_USER")
	clave := os.Getenv("DB_PASS")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	nombre := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		usuario, clave, host, port, nombre)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Error al conectar con MySQL:", err)
	}

	db.AutoMigrate(&models.Usuario{}, &models.Producto{}, &models.Compra{}, &models.Venta{})
	DB = db
	return db
}
