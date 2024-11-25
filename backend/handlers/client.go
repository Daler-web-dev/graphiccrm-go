package handlers

import (
	"backend/auth"
	"backend/database"
	"backend/model"
	"backend/utils"
	"errors"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	guuid "github.com/google/uuid"
	"gorm.io/gorm"
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

	if err := c.BodyParser(client); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code":    400,
			"message": "Invalid request",
		})
	}

	validate := validator.New()
	err := validate.Struct(client)
	if err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"code":    400,
			"message": err.Error(),
		})
	}

	var existingClient model.Client
	if err := database.DB.Where("contact_info = ?", client.ContactInfo).First(&existingClient).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"code":    409,
			"message": "Client with this contact info already exists",
		})
	}

	client.ID = guuid.New()
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

func GetClientById(c *fiber.Ctx) error {
	db := database.DB
	param := c.Params("id")
	id, err := guuid.Parse(param)
	user := c.Locals("user").(*auth.Claims)
	Client := model.Client{}

	if err != nil {
		return c.JSON(fiber.Map{
			"code":    400,
			"message": "Invalid UUID Format",
		})
	}

	query := db
	if user.Role == "seller" {
		query = query.Where("salesperson_id = ?", user.ID)
	}

	err = query.Where("id = ?", id).First(&Client).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"code":    404,
				"message": "Client not found",
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Internal Server Error",
		})
	}

	return c.JSON(fiber.Map{
		"code": 200,
		"data": Client,
	})
}
func UpdateClient(c *fiber.Ctx) error {
	type UpdateClientRequest struct {
		Name        string `json:"name" validate:"required"`
		ContactInfo string `json:"contactInfo" validate:"required"`
	}

	json := new(UpdateClientRequest)
	clientID, err := guuid.Parse(c.Params("id"))

	if err := c.BodyParser(json); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code":    400,
			"message": "Invalid request body",
		})
	}

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code":    400,
			"message": "Invalid UUID format for Client ID",
		})
	}

	validate := validator.New()
	err = validate.Struct(json)
	if err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"code":    400,
			"message": err.Error(),
		})
	}

	db := database.DB
	var client model.Client

	if err := db.First(&client, "id = ?", clientID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"code":    404,
				"message": "Client not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Internal Server Error",
		})
	}

	var existingClient model.Client
	if err := db.First(&existingClient, "contactInfo = ? AND id != ?", json.ContactInfo, clientID).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"code":    409,
			"message": "ContactInfo is already used by another client",
		})
	}

	client.Name = json.Name
	client.ContactInfo = json.ContactInfo
	if err := db.Save(&client).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Failed to update client",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"code": 200,
		"data": client,
	})
}
