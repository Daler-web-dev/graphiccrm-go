package handlers

import (
	"backend/database"
	"backend/model"
	"backend/utils"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	guuid "github.com/google/uuid"
	"gorm.io/gorm"
)

// CreateUserRequest структура для создания пользователя
type CreateUserRequest struct {
	Username string     `json:"username" validate:"required,min=3,max=50"`
	Password string     `json:"password" validate:"required,min=4,max=100"`
	Image    string     `json:"image" validate:"omitempty,min=5"`
	Role     model.Role `json:"role" validate:"required,oneof=admin manager seller"`
}

// UpdateUserRequest структура для обновления пользователя
type UpdateUserRequest struct {
	Username *string     `json:"username" validate:"required,min=3,max=50"`
	Password *string     `json:"password" validate:"required,min=4,max=100"`
	Image    *string     `json:"image" validate:"omitempty,min=5"`
	Role     *model.Role `json:"role" validate:"required,oneof=admin manager seller"`
}

type APIError struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
	Success bool   `json:"success"`
}

// @Summary		Создать пользователя
// @Description	Создаёт нового пользователя в системе
// @Tags			Users
// @Accept			json
// @Produce		json
// @Param			data	body		CreateUserRequest	true	"Данные пользователя"
// @Success		201		{object}	model.User			"Пользователь успешно создан"
// @Failure		400		{object}	APIError			"Некорректный JSON"
// @Failure		422		{object}	APIError			"Ошибка валидации данных"
// @Failure		500		{object}	APIError			"Ошибка на сервере"
// @Router			/users [post]
func CreateUser(c *fiber.Ctx) error {
	db := database.DB
	json := new(CreateUserRequest)

	if err := c.BodyParser(json); err != nil {
		return c.JSON(fiber.Map{
			"status":  400,
			"message": "Invalid JSON",
			"success": false,
		})
	}

	validate := validator.New()
	err := validate.Struct(json)
	if err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"status":  400,
			"message": err.Error(),
			"success": false,
		})
	}

	user := model.User{
		Username: json.Username,
		Image:    json.Image,
		Password: utils.HashAndSalt([]byte(json.Password)),
		ID:       guuid.New(),
		Role:     json.Role,
	}

	err = db.Create(&user).Error

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"status":  200,
		"message": "User created successfully",
		"data":    user,
	})
}

// @Summary		Получить пользователя
// @Description	Возвращает информацию о пользователе по его ID
// @Tags			Users
// @Accept			json
// @Produce		json
// @Param			id	path		string		true	"ID пользователя"
// @Success		200	{object}	model.User	"Данные пользователя"
// @Failure		400	{object}	APIError	"Неверный формат ID"
// @Failure		404	{object}	APIError	"Пользователь не найден"
// @Failure		500	{object}	APIError	"Ошибка на сервере"
// @Router			/users/{id} [get]
func GetUserById(c *fiber.Ctx) error {
	db := database.DB
	param := c.Params("id")
	id, err := guuid.Parse(param)

	if err != nil {
		return c.JSON(fiber.Map{
			"status":  400,
			"message": "Invalid UUID Format",
			"success": false,
		})
	}

	user := model.User{}
	query := model.User{ID: id}
	err = db.First(&user, &query).Error

	if err == gorm.ErrRecordNotFound {
		return c.JSON(fiber.Map{
			"status":  404,
			"message": "User not found",
			"success": false,
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  200,
		"message": "success",
		"success": true,
		"data":    user,
	})
}

// @Summary		Получить список пользователей
// @Description	Возвращает список всех пользователей с поддержкой пагинации
// @Tags			Users
// @Accept			json
// @Produce		json
// @Param			page	query		int			false	"Номер страницы (по умолчанию 1)"
// @Param			size	query		int			false	"Размер страницы (по умолчанию 10)"
// @Success		200		{array}		model.User	"Список пользователей"
// @Failure		500		{object}	APIError	"Ошибка на сервере"
// @Router			/users [get]
func GetUsers(c *fiber.Ctx) error {
	Users := []model.User{}

	respons, err := utils.Paginate(database.DB, c, map[string]interface{}{}, &Users)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"message": "Failed to retrieve users",
			"success": false,
		})
	}

	return c.JSON(respons)
}

// @Summary		Обновить данные пользователя
// @Description	Обновляет информацию о пользователе по его ID
// @Tags			Users
// @Accept			json
// @Produce		json
// @Param			id		path		string				true	"ID пользователя"
// @Param			data	body		UpdateUserRequest	true	"Обновляемые данные пользователя"
// @Success		200		{object}	model.User			"Пользователь успешно обновлён"
// @Failure		400		{object}	APIError			"Неверный формат ID или JSON"
// @Failure		404		{object}	APIError			"Пользователь не найден"
// @Failure		422		{object}	APIError			"Ошибка валидации данных"
// @Failure		500		{object}	APIError			"Ошибка на сервере"
// @Router			/users/{id} [put]
func UpdateUser(c *fiber.Ctx) error {
	db := database.DB
	param := c.Params("id")
	id, err := guuid.Parse(param)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"message": "Invalid ID format",
			"success": false,
		})
	}

	var json UpdateUserRequest
	if err := c.BodyParser(&json); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"message": "Invalid JSON",
			"success": false,
		})
	}

	if err := validator.New().Struct(json); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"status":  422,
			"message": err.Error(),
			"success": false,
		})
	}

	found := model.User{}
	err = db.First(&found, "id = ?", id).Error
	if err == gorm.ErrRecordNotFound {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  404,
			"message": "User not found",
			"success": false,
		})
	} else if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"message": "Database error",
			"success": false,
		})
	}

	if json.Username != nil {
		found.Username = *json.Username
	}
	if json.Image != nil {
		found.Image = *json.Image
	}
	if json.Password != nil {
		hashedPassword := utils.HashAndSalt([]byte(*json.Password))
		found.Password = hashedPassword
	}
	if json.Role != nil {
		found.Role = *json.Role
	}

	if err := db.Save(&found).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"message": "Failed to update user",
			"success": false,
		})
	}

	return c.JSON(fiber.Map{
		"status":  200,
		"message": "User updated successfully",
		"success": true,
		"user":    found,
	})
}

// @Summary		Удалить пользователя
// @Description	Удаляет пользователя из системы по его ID
// @Tags			Users
// @Accept			json
// @Produce		json
// @Param			id	path		string		true	"ID пользователя"
// @Success		200	{object}	model.User	"Пользователь успешно удалён"
// @Failure		400	{object}	APIError	"Неверный формат ID"
// @Failure		404	{object}	APIError	"Пользователь не найден"
// @Failure		500	{object}	APIError	"Ошибка на сервере"
// @Router			/users/{id} [delete]
func DeleteUser(c *fiber.Ctx) error {
	db := database.DB
	param := c.Params("id")
	id, err := guuid.Parse(param)

	if err != nil {
		return c.JSON(fiber.Map{
			"status":  400,
			"message": "Invalid ID format",
			"success": false,
		})
	}

	var found model.User
	err = db.First(&found, "id = ?", id).Error
	if err == gorm.ErrRecordNotFound {
		return c.JSON(fiber.Map{
			"status":  400,
			"message": "User not found",
			"success": false,
		})
	}

	err = db.Delete(&model.User{}, "id = ?", id).Error

	if err != nil {
		return c.JSON(fiber.Map{
			"status":  500,
			"message": "Failed to delete user",
			"success": false,
		})
	}

	return c.JSON(fiber.Map{
		"status":  200,
		"message": "User was removed",
		"success": true,
		"data":    found,
	})
}

// @Summary		Поиск пользователей
// @Description	Ищет пользователей по заданному запросу
// @Tags			Users
// @Accept			json
// @Produce		json
// @Param			q	query		string		true	"Поисковый запрос"
// @Success		200	{array}		model.User	"Результаты поиска пользователей"
// @Failure		400	{object}	APIError	"Отсутствует параметр запроса 'q'"
// @Failure		500	{object}	APIError	"Ошибка при поиске пользователей"
// @Router			/users/search [get]
func SearchUsers(c *fiber.Ctx) error {
	query := c.Query("q")
	if query == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Query parameter 'q' is required",
		})
	}

	var users []model.User

	err := database.DB.Raw(`
        SELECT *
        FROM users
        WHERE search_vector @@ plainto_tsquery('pg_catalog.russian', ?)
    `, query).Scan(&users).Error

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Error while searching users",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    users,
	})
}
