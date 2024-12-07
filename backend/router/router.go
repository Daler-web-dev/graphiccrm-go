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
	clients.Patch("/:id", handlers.UpdateClient)
	clients.Delete("/:id", handlers.DeleteClient)

	categoriesAdmin := router.Group("/categories", middleware.ProtectRoute("admin"))
	categoriesAdmin.Post("/", handlers.CreateCategory)
	categoriesAdmin.Delete("/:id", handlers.DeleteCategory)
	categoriesAdmin.Patch("/:id", handlers.UpdateCategory)

	categoriesForAll := router.Group("/categories", middleware.ProtectRoute("admin", "seller", "manager"))
	categoriesForAll.Get("/", handlers.GetAllCategories)
	categoriesForAll.Get("/:id", handlers.GetCategoryById)

	products := router.Group("/products", middleware.ProtectRoute("admin"))
	products.Get("/", handlers.GetAllProducts)
	products.Post("/", handlers.CreateProduct)

	upload := router.Group("/upload", middleware.ProtectRoute("admin", "seller", "manager"))
	upload.Post("/", handlers.UploadImage)

	uploadMany := router.Group("/uploadmany", middleware.ProtectRoute("admin", "seller", "manager"))
	uploadMany.Post("/", handlers.UploadMany)

	router.Post("/login", handlers.Login)
}
