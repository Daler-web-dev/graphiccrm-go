package handlers

import (
	"backend/auth"
	"backend/database"
	"backend/model"
	"backend/utils"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	guuid "github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type OrderUpdateRequest struct {
	ID            guuid.UUID         `gorm:"type:uuid;primaryKey" json:"id"`
	SalespersonID *guuid.UUID        `gorm:"type:uuid;not null;index" json:"salespersonId"`
	ClientID      *guuid.UUID        `gorm:"type:uuid;not null;index"  json:"clientId"`
	Products      *[]model.OrderItem `gorm:"foreignKey:OrderID" json:"products"`
	Status        *string            `json:"status" gorm:"not null" validate:"omitempty,oneof=pending in_production completed paid"`
	PaymentMethod *string            `json:"paymentMethod" gorm:"not null" validate:"omitempty,oneof=cash transfer credit"`
}

// CreateOrder Создать новый заказ
//
//	@Summary		Создать заказ
//	@Description	Эта функция позволяет продавцам и администраторам создать новый заказ. Заказ должен содержать как минимум один продукт.
//	@Tags			Orders
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			order	body		model.CreateOrderRequest	true	"Данные нового заказа"
//	@Success		201		{object}	model.Order					"Информация о созданном заказе"
//	@Failure		400		{object}	APIError					"Неверный запрос или некорректные данные заказа"
//	@Failure		403		{object}	APIError					"Недостаточно прав для создания заказа"
//	@Failure		422		{object}	APIError					"Ошибка валидации данных"
//	@Failure		404		{object}	APIError					"Один из указанных продуктов не найден"
//	@Failure		500		{object}	APIError					"Ошибка сервера при создании заказа"
//	@Router			/orders [post]
func CreateOrder(c *fiber.Ctx) error {
	user := c.Locals("user").(*auth.Claims)

	if user.Role != "seller" && user.Role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"status":  403,
			"success": false,
			"message": "Insufficient permissions to create an order",
		})
	}

	order := new(model.Order)
	if err := c.BodyParser(order); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Invalid request",
		})
	}

	order.Status = "pending"

	validate := validator.New()
	if err := validate.Struct(order); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"status":  422,
			"success": false,
			"message": err.Error(),
		})
	}

	if len(order.Products) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Order must include at least one product",
		})
	}

	tx := database.DB.Begin()
	defer tx.Rollback()

	order.ID = guuid.New()
	order.SalespersonID = user.ID
	order.TotalPrice = 0

	if err := tx.Omit("Products").Create(&order).Error; err != nil {
		log.Printf("Error creating order: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to create order",
		})
	}

	// Рассчитываем TotalPrice
	for i := range order.Products {
		product := &order.Products[i]
		product.OrderID = order.ID
		product.ID = guuid.New()

		// Используем транзакцию для запроса продукта
		var dbProduct model.Product
		if err := tx.First(&dbProduct, "id = ?", product.ProductID).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"status":  404,
				"success": false,
				"message": "Product not found",
			})
		}

		if dbProduct.Amount < product.Quantity {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":  400,
				"success": false,
				"message": fmt.Sprintf("Product named '%s' is not available in sufficient quantity. Only %f left.", dbProduct.Name, dbProduct.Amount),
			})
		}

		product.TotalPrice = dbProduct.Price * product.Quantity
		order.TotalPrice += product.TotalPrice // Увеличиваем TotalPrice в памяти

		// Сохраняем продукт заказа
		if err := tx.Create(&product).Error; err != nil {
			log.Println(err, "Error saving order item")
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"status":  500,
				"success": false,
				"message": "Failed to save order item",
			})
		}
	}

	// Обновляем TotalPrice заказа в базе данных
	if err := tx.Model(&order).Update("total_price", order.TotalPrice).Error; err != nil {
		log.Printf("Error updating order total price: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to update order total price",
		})
	}

	// Коммит транзакции
	if err := tx.Commit().Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to commit transaction",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  201,
		"message": "Order created successfully",
		"data":    order,
	})
}

// GetOrderByID Получить заказ по ID
//
//	@Summary		Получить заказ
//	@Description	Эта функция возвращает информацию о заказе по его уникальному идентификатору. Заказ включает все продукты в нём.
//	@Tags			Orders
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id	path		string		true	"UUID заказа"
//	@Success		200	{object}	model.Order	"Информация о заказе"
//	@Failure		400	{object}	APIError	"Некорректный формат UUID"
//	@Failure		404	{object}	APIError	"Заказ не найден"
//	@Failure		500	{object}	APIError	"Ошибка сервера при получении данных заказа"
//	@Router			/orders/{id} [get]
func GetOrderByID(c *fiber.Ctx) error {
	id, err := guuid.Parse(c.Params("id"))

	if err != nil {
		return c.JSON(fiber.Map{
			"status":   400,
			"succeess": false,
			"message":  "Invalid UUID Format",
		})
	}

	db := database.DB.Preload(clause.Associations).Preload("Products.Product")
	Order := model.Order{}

	err = db.Where("id = ?", id).First(&Order).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"status":   404,
				"succeess": false,
				"message":  "Order not found",
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":   500,
			"succeess": false,
			"message":  "Internal Server Error",
		})
	}

	return c.JSON(fiber.Map{
		"status":   200,
		"succeess": true,
		"message":  "success",
		"data":     Order,
	})
}

// GetAllOrders Получить список заказов
//
//	@Summary		Получить список всех заказов
//	@Description	Эта функция возвращает список всех заказов с поддержкой пагинации.
//	@Tags			Orders
//	@Produce		json
//	@Security		BearerAuth
//	@Param			page	query		int							false	"Номер страницы"					default(1)
//	@Param			limit	query		int							false	"Количество элементов на странице"	default(10)
//	@Success		200		{array}		model.CreateOrderRequest	"Список заказов с информацией о пагинации"
//	@Failure		500		{object}	APIError					"Ошибка сервера при получении списка заказов"
//	@Router			/orders [get]
func GetAllOrders(c *fiber.Ctx) error {
	Orders := []model.Order{}

	// Инициализация запроса
	db := database.DB

	// Обрабатываем параметр dateGte
	dateGte := c.Query("dateGte")
	if dateGte != "" {
		parsedDate, err := time.Parse("2006-01-02", dateGte)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":  400,
				"success": false,
				"message": "Invalid dateGte format, expected YYYY-MM-DD",
			})
		}
		// Добавляем фильтр по дате "с"
		db = db.Where("created_at >= ?", parsedDate)
	}

	// Обрабатываем параметр dateLte
	dateLte := c.Query("dateLte")
	if dateLte != "" {
		parsedDate, err := time.Parse("2006-01-02", dateLte)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":  400,
				"success": false,
				"message": "Invalid dateLte format, expected YYYY-MM-DD",
			})
		}
		// Добавляем фильтр по дате "до"
		db = db.Where("created_at <= ?", parsedDate)
	}

	// Выполняем пагинацию
	response, err := utils.Paginate(db, c, nil, &Orders)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to retrieve orders",
		})
	}

	return c.Status(fiber.StatusOK).JSON(response)
}

// UpdateOrder Изменить заказ
//
//	@Summary	Изменить можно любой
//	@Tags		Orders
//	@Produce	json
//	@Security	BearerAuth
//	@Param		id		path		string						true	"ID продукта"
//	@Param		order	body		model.CreateOrderRequest	true	"Данные для обновления заказа"
//	@Success	200		{object}	model.Order					"Измененный объект заказа"
//	@Failure	500		{object}	APIError					"Ошибка сервера при обновлении данных"
//	@Router		/orders [patch]
func UpdateOrder(c *fiber.Ctx) error {
	id, err := guuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Invalid UUID format for Product ID",
		})
	}

	var body OrderUpdateRequest
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Invalid request body",
		})
	}

	if err := validator.New().Struct(body); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"status":  422,
			"success": false,
			"message": err.Error(),
		})
	}

	var order model.Order
	tx := database.DB.Begin()
	defer tx.Rollback()

	if err := tx.Preload(clause.Associations).Preload("Products.Product").First(&order, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"status":  404,
				"success": false,
				"message": "Order not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Internal Server Error",
		})
	}

	if body.Products != nil {
		if len(*body.Products) <= 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":   400,
				"succeess": false,
				"message":  "Order must include at least one product",
			})
		}

		log.Println("Attempting to delete old products...")
		if err := tx.Where("order_id = ?", id).Delete(&model.OrderItem{}).Error; err != nil {
			log.Println("Error deleting old products:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"status":  500,
				"success": false,
				"message": "Failed to delete old products",
			})
		}
		log.Println("Old products deleted successfully.")

		order.Products = nil
		order.TotalPrice = 0

		for i := range *body.Products {
			product := (*body.Products)[i]
			product.OrderID = id
			product.ID = guuid.New()

			var dbProduct model.Product
			if err := database.DB.First(&dbProduct, "id = ?", product.ProductID).Error; err != nil {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
					"status":   404,
					"succeess": false,
					"message":  "Product not found",
				})
			}
			if dbProduct.Amount < product.Quantity {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"status":   400,
					"succeess": false,
					"message":  fmt.Sprintf("Product named '%s' is not available in sufficient quantity. Only %f left.", dbProduct.Name, dbProduct.Amount),
				})
			}

			product.TotalPrice = dbProduct.Price * product.Quantity
			order.TotalPrice += product.TotalPrice

			if err := tx.Create(&product).Error; err != nil {
				log.Println(err, "Error saving order item")
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"status":   500,
					"succeess": false,
					"message":  "Failed to save order item",
				})
			}
		}
	}

	if body.SalespersonID != nil {
		order.SalespersonID = *body.SalespersonID
	}
	if body.ClientID != nil {
		order.ClientID = *body.ClientID
	}
	if body.Status != nil {
		order.Status = *body.Status
	}
	if body.PaymentMethod != nil {
		order.PaymentMethod = *body.PaymentMethod
	}

	if err := tx.Save(&order).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":   500,
			"succeess": false,
			"message":  "Failed to update order",
		})
	}

	if err := tx.Commit().Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":   500,
			"succeess": false,
			"message":  "Failed to commit transaction",
		})
	}

	if err := database.DB.Preload(clause.Associations).Preload("Products.Product").First(&order, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":   500,
			"succeess": false,
			"message":  "Failed to load updated order",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  200,
		"message": "Order updated successfully",
		"order":   order,
	})
}

// DeleteOrder Удаление заказа
//
//	@Summary	Удаление заказа
//	@Tags		Orders
//	@Produce	json
//	@Security	BearerAuth
//	@Param		id	path		string		true	"UUID заказа"
//	@Success	200	{object}	model.Order	"Успешно"
//	@Failure	500	{object}	APIError	"Ошибка сервера при удалении"
//	@Router		/orders/{id} [delete]
func DeleteOrder(c *fiber.Ctx) error {
	id, err := guuid.Parse(c.Params("id"))

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Invalid ID format",
		})
	}

	db := database.DB
	tx := db.Begin()
	defer tx.Rollback()

	err = tx.Where("order_id = ?", id).Delete(&model.OrderItem{}).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to delete OrderItems",
		})
	}

	err = tx.Delete(&model.Order{}, id).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to delete Order",
		})
	}

	err = tx.Commit().Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to commit transaction",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  200,
		"success": true,
		"message": "Order was removed",
	})
}
