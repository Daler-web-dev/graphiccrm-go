package handlers

import (
	"backend/auth"
	"backend/database"
	"backend/model"
	"backend/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func CreateClient(c *fiber.Ctx) error {
	user := c.Locals("user").(*auth.Claims)

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

	// Проверка уникальности ContactInfo
	var existingClient model.Client
	if err := database.DB.Where("contact_info = ?", client.ContactInfo).First(&existingClient).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"code":    409,
			"message": "Client with this contact info already exists",
		})
	}

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

func GetAllClients(c *fiber.Ctx) error {
	user := c.Locals("user").(*auth.Claims)
	Clients := []model.Client{}

	// Проверяем роль пользователя
	var filter interface{}
	if user.Role == "seller" {
		// Если роль продавца, фильтруем по salesperson_id
		filter = map[string]interface{}{"salesperson_id": user.ID}
	}

	respons, err := utils.Paginate(database.DB, c, filter, &Clients)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Failed to retrieve clients",
		})
	}

	return c.Status(fiber.StatusOK).JSON(respons)
}
