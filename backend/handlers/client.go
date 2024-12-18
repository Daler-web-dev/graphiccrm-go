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

type UpdateClientRequest struct {
	Name        *string `json:"name" validate:"omitempty,min=2"`
	ContactInfo *string `json:"contactInfo" validate:"omitempty"`
	Address     *string `json:"address" validate:"omitempty,min=5"`
}

// CreateClient Создать нового клиента
//
//	@Summary		Создать клиента
//	@Description	Эта функция позволяет продавцам и администраторам добавить нового клиента. Уникальные контактные данные обязательны.
//	@Tags			Clients
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			client	body		model.Client			true	"Данные нового клиента"
//	@Success		201		{object}	map[string]interface{}	"Информация о созданном клиенте"
//	@Failure		400		{object}	map[string]interface{}	"Некорректные данные запроса"
//	@Failure		403		{object}	map[string]interface{}	"Недостаточно прав для создания клиента"
//	@Failure		409		{object}	map[string]interface{}	"Контактные данные уже используются другим клиентом"
//	@Failure		422		{object}	map[string]interface{}	"Ошибка валидации данных"
//	@Failure		500		{object}	map[string]interface{}	"Ошибка сервера при создании клиента"
//	@Router			/clients [post]
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

// GetAllClients Получить список всех клиентов
//
//	@Summary		Получить список клиентов
//	@Description	Эта функция возвращает список всех клиентов с поддержкой пагинации. Продавцы видят только своих клиентов.
//	@Tags			Clients
//	@Produce		json
//	@Security		BearerAuth
//	@Param			page	query		int						false	"Номер страницы"					default(1)
//	@Param			limit	query		int						false	"Количество элементов на странице"	default(10)
//	@Success		200		{object}	map[string]interface{}	"Список клиентов с информацией о пагинации"
//	@Failure		500		{object}	map[string]interface{}	"Ошибка сервера при получении списка клиентов"
//	@Router			/clients [get]
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

// GetClientById Получить информацию о клиенте
//
//	@Summary		Получить клиента
//	@Description	Эта функция возвращает данные клиента по его уникальному идентификатору. Продавцы могут видеть только своих клиентов.
//	@Tags			Clients
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id	path		string					true	"UUID клиента"
//	@Success		200	{object}	map[string]interface{}	"Информация о клиенте"
//	@Failure		400	{object}	map[string]interface{}	"Некорректный формат UUID"
//	@Failure		404	{object}	map[string]interface{}	"Клиент не найден"
//	@Failure		500	{object}	map[string]interface{}	"Ошибка сервера при получении данных клиента"
//	@Router			/clients/{id} [get]
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

// UpdateClient Обновить информацию о клиенте
//
//	@Summary		Обновить клиента
//	@Description	Эта функция позволяет обновить информацию о клиенте, включая имя, контактные данные и адрес.
//	@Tags			Clients
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id		path		string					true	"UUID клиента"
//	@Param			client	body		UpdateClientRequest		true	"Данные для обновления клиента"
//	@Success		200		{object}	map[string]interface{}	"Информация об обновлённом клиенте"
//	@Failure		400		{object}	map[string]interface{}	"Некорректный формат UUID или запроса"
//	@Failure		404		{object}	map[string]interface{}	"Клиент не найден"
//	@Failure		409		{object}	map[string]interface{}	"Контактные данные уже используются другим клиентом"
//	@Failure		422		{object}	map[string]interface{}	"Ошибка валидации данных"
//	@Failure		500		{object}	map[string]interface{}	"Ошибка сервера при обновлении клиента"
//	@Router			/clients/{id} [put]
func UpdateClient(c *fiber.Ctx) error {
	clientID, err := guuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code":    400,
			"message": "Invalid UUID format for Client ID",
		})
	}

	var json UpdateClientRequest
	if err := c.BodyParser(&json); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code":    400,
			"message": "Invalid request body",
		})
	}

	if err := validator.New().Struct(json); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"code":    422,
			"message": err.Error(),
		})
	}

	var client model.Client
	db := database.DB
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
	if err := db.First(&existingClient, "contact_info = ? AND id != ?", json.ContactInfo, clientID).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"code":    409,
			"message": "ContactInfo is already used by another client",
		})
	}

	if json.Name != nil {
		client.Name = *json.Name
	}
	if json.ContactInfo != nil {
		client.ContactInfo = *json.ContactInfo
	}
	if json.Address != nil {
		client.Address = *json.Address
	}
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

// DeleteClient Удалить клиента
//
//	@Summary		Удалить клиента
//	@Description	Эта функция позволяет удалить клиента из базы данных по его уникальному идентификатору.
//	@Tags			Clients
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id	path		string					true	"UUID клиента"
//	@Success		200	{object}	map[string]interface{}	"Клиент успешно удалён"
//	@Failure		400	{object}	map[string]interface{}	"Некорректный формат UUID"
//	@Failure		500	{object}	map[string]interface{}	"Ошибка сервера при удалении клиента"
//	@Router			/clients/{id} [delete]
func DeleteClient(c *fiber.Ctx) error {
	param := c.Params("id")
	id, err := guuid.Parse(param)

	if err != nil {
		return c.JSON(fiber.Map{
			"code":    400,
			"message": "Invalid ID format",
		})
	}

	db := database.DB
	err = db.Delete(&model.Client{}, "id = ?", id).Error

	if err != nil {
		return c.JSON(fiber.Map{
			"code":    500,
			"message": "Failed to delete Client",
		})
	}

	return c.JSON(fiber.Map{
		"code":    200,
		"message": "Client was removed",
	})
}
