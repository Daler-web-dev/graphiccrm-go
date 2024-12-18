package handlers

import (
	"backend/database"
	"backend/model"
	"backend/utils"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// Login Авторизация пользователя
//	@Summary		Авторизация пользователя
//	@Description	Эта функция позволяет пользователю войти в систему с помощью имени пользователя и пароля, и получить JWT-токен для дальнейшей аутентификации.
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Param			request	body		object					true	"Данные для авторизации"
//	@Success		200		{object}	map[string]interface{}	"Успешная авторизация, возвращается JWT-токен"
//	@Failure		400		{object}	map[string]interface{}	"Некорректный формат JSON"
//	@Failure		401		{object}	map[string]interface{}	"Неверный пароль"
//	@Failure		404		{object}	map[string]interface{}	"Имя пользователя не найдено"
//	@Failure		500		{object}	map[string]interface{}	"Ошибка при генерации токена"
//	@Router			/auth/login [post]
func Login(c *fiber.Ctx) error {
	type LoginRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	db := database.DB
	json := new(LoginRequest)

	if err := c.BodyParser(json); err != nil {
		return c.JSON(fiber.Map{
			"code":    400,
			"message": "Invalid JSON",
		})
	}

	found := model.User{}

	query := model.User{Username: json.Username}
	err := db.First(&found, &query).Error
	if err == gorm.ErrRecordNotFound {
		return c.JSON(fiber.Map{
			"code":    404,
			"message": "Username not found",
		})
	}
	if !utils.ComparePasswords(found.Password, []byte(json.Password)) {
		return c.JSON(fiber.Map{
			"code":    401,
			"message": "Invalid Password",
		})
	}

	tokenString, err := utils.GenerateJWT(found)

	if err != nil {
		return c.JSON(fiber.Map{
			"code":    500,
			"message": "Could not generate token",
		})
	}

	return c.JSON(fiber.Map{
		"code":    200,
		"message": "success",
		"token":   tokenString,
	})
}
