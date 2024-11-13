package handlers

import (
	"backend/auth"
	"backend/database"
	"backend/model"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// CreateClient handles creating a new client
func CreateClient(c *fiber.Ctx) error {
	// Извлечение информации о пользователе из контекста
	user := c.Locals("user").(*auth.Claims)

	// Проверка роли пользователя
	if user.Role != "seller" && user.Role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"code":    403,
			"message": "Insufficient permissions to create a client",
		})
	}

	client := new(model.Client)

	// Парсинг данных запроса в структуру клиента
	if err := c.BodyParser(client); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code":    400,
			"message": "Invalid request",
		})
	}
	log.Println(user.Id)

	client.ID = uuid.New()
	client.SalespersonID = user.ID

	// Сохранение клиента в базе данных
	if err := database.DB.Create(&client).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Could not create client",
		})
	}

	// Возвращаем данные созданного клиента
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"code":    201,
		"message": "Client created successfully",
		"data":    client,
	})
}
