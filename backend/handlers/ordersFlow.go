package handlers

import (
	"backend/database"
	"backend/model"
	"errors"
	"fmt"
	"slices"

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
//	@Param			id					path		string			true	"ID заказа"
//	@Success		201					{object}	ResponseSuccess	"Заказ успешно принят"
//	@Failure		400					{object}	APIError		"Неверный формат UUID"
//	@Router			/orders/{id}/accept	[POST]
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

	order.Status = "accepted"
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

// RejectOrder Отклонить заказ
//
//	@Summary		Отклонить заказ
//	@Description	Отклоняет заказ и изменяет его статус на "rejected"
//	@Tags			Orders
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id					path		string			true	"ID заказа"
//	@Success		201					{object}	ResponseSuccess	"Заказ успешно отклонен"
//	@Failure		400					{object}	APIError		"Неверный формат UUID"
//	@Router			/orders/{id}/reject	[POST]
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

	// Проверяем допустимые статусы для отклонения
	if !slices.Contains([]string{"pending"}, order.Status) {
		tx.Rollback()
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": fmt.Sprintf("Order cannot be rejected from '%s' status", order.Status),
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
		"data":    order,
	})
}

// InProduction Перенести в производство
//
//	@Summary		В производство
//	@Description	изменяет статус заказа на "in_production"
//	@Tags			warehouse
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id								path		string			true	"ID заказа"
//	@Success		201								{object}	ResponseSuccess	"Заказ успешно изменен"
//	@Failure		400								{object}	APIError		"Неверный формат UUID"
//	@Router			/warehouse/{id}/in_production	[POST]
func InProduction(c *fiber.Ctx) error {
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

	// Проверяем допустимые статусы для производства
	if !slices.Contains([]string{"accepted"}, order.Status) {
		tx.Rollback()
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": fmt.Sprintf("Order cannot be in_production from '%s' status", order.Status),
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

	if err := tx.Commit().Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to finalize transaction",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Order in production",
		"data":    order,
	})
}

// OrderReady Перенести в готово
//
//	@Summary		Готово
//	@Description	изменяет статус заказа на "ready"
//	@Tags			warehouse
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id								path		string			true	"ID заказа"
//	@Success		201								{object}	ResponseSuccess	"Заказ успешно изменен"
//	@Failure		400								{object}	APIError		"Неверный формат UUID"
//	@Router			/warehouse/{id}/in_production	[POST]
func OrderReady(c *fiber.Ctx) error {
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

	// Проверяем допустимые статусы для производства
	if !slices.Contains([]string{"in_production"}, order.Status) {
		tx.Rollback()
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": fmt.Sprintf("Order cannot be ready from '%s' status", order.Status),
		})
	}

	order.Status = "ready"
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
		"message": "Order is ready",
		"data":    order,
	})
}

// Delivered Перенести в готово
//
//	@Summary		Доставлен
//	@Description	изменяет статус заказа на "delivered"
//	@Tags			warehouse
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id							path		string			true	"ID заказа"
//	@Success		201							{object}	ResponseSuccess	"Заказ успешно изменен"
//	@Failure		400							{object}	APIError		"Неверный формат UUID"
//	@Router			/warehouse/{id}/delivered	[POST]
func Delivered(c *fiber.Ctx) error {
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

	// Проверяем допустимые статусы для производства
	if !slices.Contains([]string{"ready"}, order.Status) {
		tx.Rollback()
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": fmt.Sprintf("Order cannot be delivered from '%s' status", order.Status),
		})
	}

	order.Status = "delivered"
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
		"message": "Order is delivered",
		"data":    order,
	})
}
