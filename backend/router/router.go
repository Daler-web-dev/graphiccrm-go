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

	// users := router.Group("/api/users", middleware.ProtectRoute("admin"))
	users := router.Group("/users")
	users.Post("/", handlers.CreateUser)
	users.Get("/", handlers.GetUsers)
	users.Get("/search", handlers.SearchUsers)
	users.Get("/:id", handlers.GetUserById)
	users.Patch("/:id", handlers.UpdateUser)
	users.Delete("/:id", handlers.DeleteUser)

	clients := router.Group("/clients", middleware.ProtectRoute("admin", "seller"))
	clients.Post("/", handlers.CreateClient)
	clients.Get("/", handlers.GetAllClients)
	clients.Get("/search", handlers.SearchClients)
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

	products := router.Group("/products", middleware.ProtectRoute("admin", "manager"))
	products.Get("/", handlers.GetAllProducts)
	products.Get("/search", handlers.SearchProducts)
	products.Get("/stat/:id", handlers.GetSingleProductStatistics)
	products.Post("/", handlers.CreateProduct)
	products.Patch("/:id", handlers.UpdateProduct)
	products.Get("/:id", handlers.GetProductById)
	products.Delete("/:id", handlers.DeleteProduct)

	productsForSeller := router.Group("/products", middleware.ProtectRoute("seller"))
	productsForSeller.Get("/", handlers.GetAllProducts)
	productsForSeller.Get("/search", handlers.SearchProducts)
	productsForSeller.Get("/:id", handlers.GetProductById)

	exports := router.Group("/exports", middleware.ProtectRoute("admin"))
	exports.Get("/products", handlers.ExportProductsHandler)
	exports.Get("/clients", handlers.ExportClientsHandler)

	stats := router.Group("/statistics", middleware.ProtectRoute("admin"))
	stats.Get("/products", handlers.GetProductStatistics)
	stats.Get("/dashboard", handlers.GetDashboard)
	stats.Get("/chart", handlers.GetSalesChart)

	upload := router.Group("/upload", middleware.ProtectRoute("admin", "seller", "manager"))
	upload.Post("/", handlers.UploadImage)

	uploadMany := router.Group("/uploadmany", middleware.ProtectRoute("admin", "seller", "manager"))
	uploadMany.Post("/", handlers.UploadMany)

	orders := router.Group("/orders", middleware.ProtectRoute("admin", "seller", "manager"))
	orders.Post("/", handlers.CreateOrder)
	orders.Get("/", handlers.GetAllOrders)
	orders.Get("/:id", handlers.GetOrderByID)
	orders.Get("/pdf/:id", handlers.GetOrderPDF)
	// orders.Patch("/:id", handlers.UpdateOrder)
	// orders.Delete("/:id", handlers.DeleteOrder)

	ordersFlow := router.Group("/orders", middleware.ProtectRoute("admin"))
	ordersFlow.Post("/:id/accept", handlers.AcceptOrder)
	ordersFlow.Post("/:id/reject", handlers.RejectOrder)

	warehouseOrderFlow := router.Group("/warehouse", middleware.ProtectRoute("manager"))
	warehouseOrderFlow.Post("/:id/in_production", handlers.InProduction)
	warehouseOrderFlow.Post("/:id/ready", handlers.OrderReady)
	warehouseOrderFlow.Post("/:id/delivered", handlers.Delivered)

	router.Post("/login", handlers.Login)
}
