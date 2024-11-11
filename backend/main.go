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
		AllowOrigins: "*", // comma string format e.g. "localhost, nikschaefer.tech"
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Use(middleware.Security)

	database.ConnectDB()

	router.Initalize(app)
	log.Fatal(app.Listen(":" + utils.Getenv("PORT", "8080")))
}
