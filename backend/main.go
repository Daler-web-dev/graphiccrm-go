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
		AllowOrigins: "*",
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders: "Authorization, Content-Type",
	}))

	app.Use(middleware.Security)

	database.ConnectDB()

	app.Static("/uploads", "./uploads")

	router.Initalize(app)
	log.Fatal(app.Listen(":" + utils.Getenv("PORT", "8080")))
}
