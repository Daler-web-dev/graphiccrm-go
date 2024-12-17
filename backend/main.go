package main

import (
	"backend/database"
	"backend/middleware"
	"backend/router"
	"backend/utils"
	"log"

	"github.com/gofiber/swagger"

	_ "backend/docs"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

//	@title			Fiber CRM-API
//	@version		1.0
//	@description	This is a sample swagger for Fiber
//	@termsOfService	http://swagger.io/terms/

func main() {
	godotenv.Load()
	app := fiber.New()
	app.Get("/api/swagger/*", swagger.HandlerDefault) // добавляем документацию по адресу /swagger/

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173/",
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders: "Authorization, Content-Type",
	}))

	app.Use(middleware.Security)

	database.ConnectDB()

	app.Static("/uploads", "./uploads")

	router.Initalize(app)
	log.Fatal(app.Listen(":" + utils.Getenv("PORT", "8080")))
}
