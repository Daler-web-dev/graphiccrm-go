package handlers

import (
	"backend/auth"
	"backend/database"
	"backend/model"
	"backend/utils"
	"errors"
	"fmt"
	"log"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	guuid "github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func CreateOrder(c *fiber.Ctx) error {
	user := c.Locals("user").(*auth.Claims)

	if user.Role != "seller" && user.Role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"code":    403,
			"message": "Insufficient permissions to create an order",
		})
	}

	order := new(model.Order)
	if err := c.BodyParser(order); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code":    400,
			"message": "Invalid request",
		})
	}

	validate := validator.New()
	if err := validate.Struct(order); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"code":    422,
			"message": err.Error(),
		})
	}

	if len(order.Products) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code":    400,
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
			"code":    500,
			"message": "Failed to create order",
		})
	}

	for i := range order.Products {
		product := &order.Products[i]
		product.OrderID = order.ID
		product.ID = guuid.New()

		var dbProduct model.Product
		if err := database.DB.First(&dbProduct, "id = ?", product.ProductID).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"code":    404,
				"message": "Product not found",
			})
		}
		if dbProduct.Amount < product.Quantity {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"code":    400,
				"message": fmt.Sprintf("Product named '%s' is not available in sufficient quantity. Only %f left.", dbProduct.Name, dbProduct.Amount),
			})
		}

		product.TotalPrice = dbProduct.Price * product.Quantity
		order.TotalPrice += product.TotalPrice

		if err := tx.Create(&product).Error; err != nil {
			log.Println(err, "Error saving order item")
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"code":    500,
				"message": "Failed to save order item",
			})
		}
	}

	if err := tx.Commit().Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Failed to commit transaction",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"code":    201,
		"message": "Order created successfully",
		"order":   order,
	})
}
func GetOrderByID(c *fiber.Ctx) error {
	id, err := guuid.Parse(c.Params("id"))

	if err != nil {
		return c.JSON(fiber.Map{
			"code":    400,
			"message": "Invalid UUID Format",
		})
	}

	db := database.DB.Preload(clause.Associations).Preload("Products.Product")
	Order := model.Order{}

	err = db.Where("id = ?", id).First(&Order).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"code":    404,
				"message": "Order not found",
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Internal Server Error",
		})
	}

	return c.JSON(fiber.Map{
		"code": 200,
		"data": Order,
	})
}

func GetAllOrders(c *fiber.Ctx) error {
	Orders := []model.Order{}

	respons, err := utils.Paginate(database.DB, c, map[string]interface{}{}, &Orders)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Failed to retrieve orders",
		})
	}

	return c.Status(fiber.StatusOK).JSON(respons)
}
