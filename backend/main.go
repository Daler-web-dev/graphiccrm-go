package main

import (
	"backend/database"
	"backend/middleware"
	"backend/router"
	"backend/utils"
	"log"

	_ "backend/docs"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/swagger"
	"github.com/joho/godotenv"
)

//	@title						Fiber CRM-API
//	@version					1.0
//	@description				This is a sample swagger for Fiber
//	@termsOfService				http://swagger.io/terms/
//	@securityDefinitions.apikey	BearerAuth
//	@in							header
//	@name						Authorization

//	ec2-43-207-54-55.ap-northeast-1.compute.amazonaws.com

//	@host		ec2-43-207-54-55.ap-northeast-1.compute.amazonaws.com
//	@BasePath	/api

//	@securityDefinitions.apikey	BearerAuth
//	@in							header
//	@name						Authorization

//	@Security	BearerAuth

func main() {
	godotenv.Load()
	app := fiber.New()
	app.Get("/api/swagger/*", swagger.HandlerDefault)

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders: "Authorization, Content-Type",
	}))

	app.Use(middleware.Security)

	database.ConnectDB()

	app.Static("/api/uploads", "./uploads")

	router.Initalize(app)
	log.Fatal(app.Listen(":" + utils.Getenv("PORT", "8080")))
}
