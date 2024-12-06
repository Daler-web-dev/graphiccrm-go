package main

import (
	"backend/database"
	"backend/middleware"
	"backend/router"
	"backend/utils"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://127.0.0.1:5500",                  // comma string format e.g. "localhost, nikschaefer.tech"
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS", // Методы
		AllowHeaders: "Authorization, Content-Type",            // Разрешённые заголовки
	}))

	app.Use(middleware.Security)

	database.ConnectDB()

	app.Static("/uploads", "./uploads")

	router.Initalize(app)
	log.Fatal(app.Listen(":" + utils.Getenv("PORT", "8080")))
}
