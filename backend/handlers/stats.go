package handlers

import (
	"backend/database"
	"backend/model"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	guuid "github.com/google/uuid"
)

type DashboardResponse struct {
	TopClients  []ClientSummary  `json:"top_clients"`
	TopProducts []ProductSummary `json:"top_products"`
}

type ClientSummary struct {
	ClientID   guuid.UUID `json:"client_id"`
	ClientName string     `json:"client_name"`
	TotalSpent float64    `json:"total_spent"`
	OrderCount int        `json:"order_count"`
}

type ProductSummary struct {
	ProductID   guuid.UUID `json:"product_id"`
	ProductName string     `json:"product_name"`
	TotalSold   float64    `json:"total_sold"`
	UnitsSold   int        `json:"units_sold"`
}

type SalesData struct {
	TotalAmount float64 `json:"total_amount"`
	Date        string  `json:"date"`
}

// GetAllProductsStatistics Получить статистику всех продуктов
//
//	@Summary		Получить статистику всех продуктов
//	@Description	Возвращает статистику по всем продуктам, включая количество произведенного и проданного за текущий месяц
//	@Tags			Statistics
//	@Produce		json
//	@Success		200	{array}		ProductStatistics	"Список со статистикой всех продуктов"
//	@Failure		500	{object}	APIError			"Ошибка сервера"
//	@Router			/statistics/products [get]
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

// GetDashboard Получить топ клиентов и продуктов
//
//	@Summary		Получить топ клиентов и продуктов
//	@Description	Возвращает топ 10 клиентов и продуктов по сумме потраченных денег и проданных единиц за текущий месяц
//	@Tags			Statistics
//	@Param			period	query	string	false	"Период статистики (month, year)"
//	@Produce		json
//	@Success		200	{array}		DashboardResponse	"Список со статистикой всех продуктов"
//	@Failure		500	{object}	APIError			"Ошибка сервера"
//	@Router			/statistics/dashboard [get]
func GetDashboard(c *fiber.Ctx) error {
	period := c.Query("period", "month")

	startDate, endDate, err := getDateRange(period)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	db := database.DB

	var topClients []ClientSummary
	err = db.Model(&model.Order{}).
		Select(`
				clients.id as client_id,
				CONCAT(clients.name, ' ', clients.surname) as client_name,
				SUM(orders.total_price) as total_spent,
				COUNT(orders.id) as order_count
			`).
		Joins("JOIN clients ON clients.id = orders.client_id").
		Where("orders.created_at BETWEEN ? AND ?", startDate, endDate).
		Group("clients.id, clients.name, clients.surname").
		Order("total_spent DESC").
		Limit(10).
		Scan(&topClients).Error

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch top clients",
		})
	}

	var topProducts []ProductSummary
	err = db.Model(&model.Order{}).
		Select(`
				products.id as product_id,
				products.name as product_name,
				SUM(order_items.quantity * products.price) as total_sold,
				SUM(order_items.quantity) as units_sold
			`).
		Joins("JOIN order_items ON order_items.order_id = orders.id").
		Joins("JOIN products ON products.id = order_items.product_id").
		Where("orders.created_at BETWEEN ? AND ?", startDate, endDate).
		Group("products.id, products.name").
		Order("total_sold DESC").
		Limit(10).
		Scan(&topProducts).Error

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch top products",
		})
	}

	return c.JSON(DashboardResponse{
		TopClients:  topClients,
		TopProducts: topProducts,
	})
}

// GetSalesChart Получить статистику продаж
//
//	@Summary		Получить статистику продаж
//	@Description	Возвращает статистику продаж за последний месяц или год
//	@Tags			Statistics
//	@Param			period	query	string	false	"Период статистики (month, year)"
//	@Produce		json
//	@Success		200	{array}		[]SalesData	"Список со статистикой всех продуктов"
//	@Failure		500	{object}	APIError	"Ошибка сервера"
//	@Router			/statistics/chart [get]
func GetSalesChart(c *fiber.Ctx) error {
	period := c.Query("period", "month")
	db := database.DB

	now := time.Now()
	var startDate, endDate time.Time

	switch period {
	case "year":
		startDate = now.AddDate(-1, 0, 0) // Last 12 months
		endDate = now
	case "month":
		startDate = now.AddDate(0, 0, -30) // Last 30 days
		endDate = now
	default:
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid period parameter. Use 'month' or 'year'",
		})
	}

	// Get sales data from database
	var results []SalesData
	dateFormat := getPeriodFormat(period)
	query := db.Model(&model.Order{}).
		Select(
			"COALESCE(SUM(total_price), 0) as total_amount",
			fmt.Sprintf("to_char(created_at, '%s') as date", dateFormat),
		).
		Where("status NOT IN (?)", []string{"rejected", "pending"}).
		Where("created_at BETWEEN ? AND ?", startDate, endDate).
		Group("date").
		Order("date ASC")

	if err := query.Scan(&results).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch sales data",
		})
	}

	// Create map for quick lookup
	resultMap := make(map[string]float64)
	for _, res := range results {
		resultMap[res.Date] = res.TotalAmount
	}

	// Generate all possible dates/months in period
	var generated []SalesData
	current := startDate
	layout := getGoLayout(period)

	for {
		// Stop condition
		if (period == "year" && current.After(endDate)) ||
			(period == "month" && current.After(endDate.AddDate(0, 0, 1))) {
			break
		}

		// Format date according to period
		dateStr := current.Format(layout)
		amount := resultMap[dateStr]

		generated = append(generated, SalesData{
			Date:        dateStr,
			TotalAmount: amount,
		})

		// Increment based on period
		if period == "year" {
			current = current.AddDate(0, 1, 0)
		} else {
			current = current.AddDate(0, 0, 1)
		}
	}

	return c.JSON(generated)
}

// Helper to get PostgreSQL date format
func getPeriodFormat(period string) string {
	if period == "year" {
		return "YYYY-MM"
	}
	return "YYYY-MM-DD"
}

// Helper to get Go date layout
func getGoLayout(period string) string {
	if period == "year" {
		return "2006-01"
	}
	return "2006-01-02"
}

func getDateRange(period string) (time.Time, time.Time, error) {
	now := time.Now()
	location := now.Location()

	switch period {
	case "month":
		start := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, location)
		end := start.AddDate(0, 1, -1).Add(23*time.Hour + 59*time.Minute + 59*time.Second)
		return start, end, nil
	case "year":
		start := time.Date(now.Year(), 1, 1, 0, 0, 0, 0, location)
		end := start.AddDate(1, 0, -1).Add(23*time.Hour + 59*time.Minute + 59*time.Second)
		return start, end, nil
	default:
		return time.Time{}, time.Time{}, fmt.Errorf("invalid period. Use 'month' or 'year'")
	}
}
