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
	Role     model.Role `json:"role" validate:"required,oneof=admin manager seller"`
}

// UpdateUserRequest структура для обновления пользователя
type UpdateUserRequest struct {
	Username *string     `json:"username" validate:"required,min=3,max=50"`
	Password *string     `json:"password" validate:"required,min=4,max=100"`
	Role     *model.Role `json:"role" validate:"required,oneof=admin manager seller"`
}

// @Summary Создать пользователя
// @Description Создаёт нового пользователя в системе
// @Tags Пользователи
// @Accept json
// @Produce json
// @Param data body CreateUserRequest true "Данные пользователя"
// @Success 201 {object} map[string]string "Пользователь успешно создан"
// @Failure 400 {object} map[string]string "Некорректный JSON"
// @Failure 422 {object} map[string]string "Ошибка валидации данных"
// @Failure 500 {object} map[string]string "Ошибка на сервере"
// @Router /users [post]
func CreateUser(c *fiber.Ctx) error {
	db := database.DB
	json := new(CreateUserRequest)

	if err := c.BodyParser(json); err != nil {
		return c.JSON(fiber.Map{
			"status":  400,
			"message": "Invalid JSON",
		})
	}

	validate := validator.New()
	err := validate.Struct(json)
	if err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"code":    400,
			"message": err.Error(),
		})
	}

	err = db.Create(&model.User{
		Username: json.Username,
		Password: utils.HashAndSalt([]byte(json.Password)),
		ID:       guuid.New(),
		Role:     json.Role,
	}).Error

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.JSON(fiber.Map{
		"code":    201,
		"message": "success",
	})
}

// @Summary Получить пользователя
// @Description Возвращает информацию о пользователе по его ID
// @Tags Пользователи
// @Accept json
// @Produce json
// @Param id path string true "ID пользователя"
// @Success 200 {object} model.User "Данные пользователя"
// @Failure 400 {object} map[string]string "Неверный формат ID"
// @Failure 404 {object} map[string]string "Пользователь не найден"
// @Failure 500 {object} map[string]string "Ошибка на сервере"
// @Router /users/{id} [get]
func GetUserById(c *fiber.Ctx) error {
	db := database.DB
	param := c.Params("id")
	id, err := guuid.Parse(param)

	if err != nil {
		return c.JSON(fiber.Map{
			"code":    400,
			"message": "Invalid UUID Format",
		})
	}

	user := model.User{}
	query := model.User{ID: id}
	err = db.First(&user, &query).Error

	if err == gorm.ErrRecordNotFound {
		return c.JSON(fiber.Map{
			"code":    404,
			"message": "User not found",
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"code": 200,
		"data": user,
	})
}

// @Summary Получить список пользователей
// @Description Возвращает список всех пользователей с поддержкой пагинации
// @Tags Пользователи
// @Accept json
// @Produce json
// @Param page query int false "Номер страницы (по умолчанию 1)"
// @Param size query int false "Размер страницы (по умолчанию 10)"
// @Success 200 {object} map[string]interface{} "Список пользователей"
// @Failure 500 {object} map[string]string "Ошибка на сервере"
// @Router /users [get]
func GetUsers(c *fiber.Ctx) error {
	Users := []model.User{}

	respons, err := utils.Paginate(database.DB, c, map[string]interface{}{}, &Users)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Failed to retrieve clients",
		})
	}

	return c.JSON(respons)
}

// @Summary Обновить данные пользователя
// @Description Обновляет информацию о пользователе по его ID
// @Tags Пользователи
// @Accept json
// @Produce json
// @Param id path string true "ID пользователя"
// @Param data body UpdateUserRequest true "Обновляемые данные пользователя"
// @Success 200 {object} map[string]interface{} "Пользователь успешно обновлён"
// @Failure 400 {object} map[string]string "Неверный формат ID или JSON"
// @Failure 404 {object} map[string]string "Пользователь не найден"
// @Failure 422 {object} map[string]string "Ошибка валидации данных"
// @Failure 500 {object} map[string]string "Ошибка на сервере"
// @Router /users/{id} [put]
func UpdateUser(c *fiber.Ctx) error {
	db := database.DB
	param := c.Params("id")
	id, err := guuid.Parse(param)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code":    400,
			"message": "Invalid ID format",
		})
	}

	var json UpdateUserRequest
	if err := c.BodyParser(&json); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code":    400,
			"message": "Invalid JSON",
		})
	}

	if err := validator.New().Struct(json); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"code":    422,
			"message": err.Error(),
		})
	}

	found := model.User{}
	err = db.First(&found, "id = ?", id).Error
	if err == gorm.ErrRecordNotFound {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"code":    404,
			"message": "User not found",
		})
	} else if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Database error",
		})
	}

	if json.Username != nil {
		found.Username = *json.Username
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
			"code":    500,
			"message": "Failed to update user",
		})
	}

	return c.JSON(fiber.Map{
		"code":    200,
		"message": "User updated successfully",
		"user":    found,
	})
}

// @Summary Удалить пользователя
// @Description Удаляет пользователя из системы по его ID
// @Tags Пользователи
// @Accept json
// @Produce json
// @Param id path string true "ID пользователя"
// @Success 200 {object} map[string]interface{} "Пользователь успешно удалён"
// @Failure 400 {object} map[string]string "Неверный формат ID"
// @Failure 404 {object} map[string]string "Пользователь не найден"
// @Failure 500 {object} map[string]string "Ошибка на сервере"
// @Router /users/{id} [delete]
func DeleteUser(c *fiber.Ctx) error {
	db := database.DB
	param := c.Params("id")
	id, err := guuid.Parse(param)

	if err != nil {
		return c.JSON(fiber.Map{
			"code":    400,
			"message": "Invalid ID format",
		})
	}

	var found model.User
	err = db.First(&found, "id = ?", id).Error
	if err == gorm.ErrRecordNotFound {
		return c.JSON(fiber.Map{
			"code":    400,
			"message": "User not found",
		})
	}

	err = db.Delete(&model.User{}, "id = ?", id).Error

	if err != nil {
		return c.JSON(fiber.Map{
			"code":    500,
			"message": "Failed to delete user",
		})
	}

	return c.JSON(fiber.Map{
		"code":    200,
		"message": "User was removed",
		"data":    found,
	})
}
