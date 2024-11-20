package router

import (
	"backend/handlers"
	"backend/middleware"

	"github.com/gofiber/fiber/v2"
)

func Initalize(router *fiber.App) {

	router.Get("/", func(c *fiber.Ctx) error {
		return c.Status(200).SendString("Hello to the crm world!")
	})

	users := router.Group("/users", middleware.ProtectRoute("admin"))
	users.Get("/", handlers.GetUsers)
	users.Post("/", handlers.CreateUser)
	users.Get("/:id", handlers.GetUserById)
	users.Patch("/:id", handlers.UpdateUser)
	users.Delete("/:id", handlers.DeleteUser)

	clients := router.Group("/clients", middleware.ProtectRoute("admin", "seller"))
	clients.Post("/", handlers.CreateClient)
	clients.Get("/", handlers.GetAllClients)
	clients.Get("/:id", handlers.GetClientById)

	router.Post("/login", handlers.Login)
}
