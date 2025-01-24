package handlers

import (
	"backend/database"
	"time"

	"github.com/gofiber/fiber/v2"
	guuid "github.com/google/uuid"
)

func GetTopCustomers(c *fiber.Ctx) error {
	// month := c.Params("month", "1")
	// year := c.Params("year", "1")

	return nil
}
func GetTopProducts(c *fiber.Ctx) error {
	return nil
}

// GetAllProductsStatistics Получить статистику всех продуктов
//
//	@Summary		Получить статистику всех продуктов
//	@Description	Возвращает статистику по всем продуктам, включая количество произведенного и проданного за текущий месяц
//	@Tags			Products
//	@Produce		json
//	@Success		200	{array}		ProductStatistics	"Список со статистикой всех продуктов"
//	@Failure		500	{object}	APIError			"Ошибка сервера"
//	@Router			/products/statistics [get]
func GetProductStatistics(c *fiber.Ctx) error {
	type ProductStats struct {
		ProductID        guuid.UUID `json:"productId"`
		ProductName      string     `json:"productName"`
		SoldQuantity     float64    `json:"soldQuantity"`
		ProducedQuantity float64    `json:"producedQuantity"`
	}

	var stats []ProductStats
	currentMonth := time.Now().Month()

	// Подсчет проданных продуктов
	err := database.DB.Table("order_items").
		Select("products.id as product_id, products.name as product_name, SUM(order_items.quantity) as sold_quantity").
		Joins("JOIN products ON products.id = order_items.product_id").
		Joins("JOIN orders ON orders.id = order_items.order_id").
		Where("EXTRACT(MONTH FROM orders.created_at) = ?", currentMonth).
		Group("products.id, products.name").
		Scan(&stats).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to fetch sold product statistics",
		})
	}

	// Подсчет произведенных продуктов
	var productionStats []struct {
		ProductID        guuid.UUID `json:"productId"`
		ProducedQuantity float64    `json:"producedQuantity"`
	}
	err = database.DB.Table("production_logs").
		Select("product_id, SUM(quantity) as produced_quantity").
		Where("EXTRACT(MONTH FROM created_at) = ?", currentMonth).
		Group("product_id").
		Scan(&productionStats).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to fetch produced product statistics",
		})
	}

	// Слияние данных о продажах и производстве
	for i, stat := range stats {
		for _, prod := range productionStats {
			if stat.ProductID == prod.ProductID {
				stats[i].ProducedQuantity = prod.ProducedQuantity
				break
			}
		}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  200,
		"success": true,
		"data":    stats,
	})
}
