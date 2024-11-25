package database

import (
	"backend/model"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDB() {
	var err error

	env := os.Getenv("DATABASE_URL")
	DB, err = gorm.Open(postgres.Open(env), &gorm.Config{})

	if err != nil {
		log.Fatal(err)
	}

	err = DB.AutoMigrate(&model.User{}, &model.Client{}, &model.Category{}, &model.Product{}, &model.Order{}, &model.OrderItem{})
	if err != nil {
		log.Fatal(err)
	}
}
