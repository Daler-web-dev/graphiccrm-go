package handlers

import (
	"backend/database"
	"backend/model"
	"errors"
	"fmt"

	"github.com/gofiber/fiber/v2"
	guuid "github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type ResponseSuccess struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// AcceptOrder Принять заказ
//
//	@Summary		Принять заказ
//	@Description	Принимает заказ и изменяет его статус на "в производстве"
//	@Tags			Orders
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id				path		string			true	"ID заказа"
//	@Success		201				{object}	ResponseSuccess	"Заказ успешно принят"
//	@Failure		400				{object}	APIError		"Неверный формат UUID"
//	@Router			/accept/{id}	[POST]
func AcceptOrder(c *fiber.Ctx) error {
	id, err := guuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid UUID format for Order ID",
		})
	}

	tx := database.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	order := model.Order{}
	err = tx.Preload("Products.Product").
		Clauses(clause.Locking{Strength: "UPDATE"}).
		Where("id = ?", id).
		First(&order).Error

	if err != nil {
		tx.Rollback()
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"message": "Order not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Internal Server Error",
		})
	}

	if order.Status != "pending" {
		tx.Rollback()
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Order cannot be accepted in its current status",
		})
	}

	order.Status = "in_production"
	if err := tx.Save(&order).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to update order status",
		})
	}

	for _, item := range order.Products {
		if item.Product == nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"message": "Product information missing",
			})
		}

		if item.Product.Amount < item.Quantity {
			tx.Rollback()
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": fmt.Sprintf("Not enough stock for product %s", item.Product.ID),
			})
		}

		item.Product.Amount -= item.Quantity
		if err := tx.Save(item.Product).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"message": "Failed to update product quantity",
			})
		}
	}

	if err := tx.Commit().Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to finalize transaction",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"success": true,
		"message": "Order accepted successfully",
	})
}

func RejectOrder(c *fiber.Ctx) error {
	id, err := guuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid UUID format for Order ID",
		})
	}

	tx := database.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	order := model.Order{}
	err = tx.Preload("Products.Product").
		Clauses(clause.Locking{Strength: "UPDATE"}).
		Where("id = ?", id).
		First(&order).Error

	if err != nil {
		tx.Rollback()
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"message": "Order not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Internal Server Error",
		})
	}

	if order.Status != "pending" {
		tx.Rollback()
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Order cannot be accepted in its current status",
		})
	}

	order.Status = "rejected"
	if err := tx.Save(&order).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to update order status",
		})
	}

	if err := tx.Commit().Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to finalize transaction",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Order rejected successfully",
	})
}
