package handlers

import (
	"backend/database"
	"backend/model"
	"backend/utils"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
type LoginResponse struct {
	Code    int    `json:"status" example:"200"`
	Message string `json:"message" example:"success"`
	Token   string `json:"token" example:"JWTOKEN"`
}

// Login Авторизация пользователя
//
//	@Summary		Авторизация пользователя
//	@Description	Эта функция позволяет пользователю войти в систему с помощью имени пользователя и пароля, и получить JWT-токен для дальнейшей аутентификации.
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Param			request	body		LoginRequest	true	"Данные для авторизации"
//	@Success		200		{object}	LoginResponse	"Успешная авторизация, возвращается JWT-токен"
//	@Failure		400		{object}	APIError		"Некорректный формат JSON"
//	@Failure		401		{object}	APIError		"Неверный пароль"
//	@Failure		404		{object}	APIError		"Имя пользователя не найдено"
//	@Failure		500		{object}	APIError		"Ошибка при генерации токена"
//	@Router			/login [post]
func Login(c *fiber.Ctx) error {
	db := database.DB
	json := new(LoginRequest)

	if err := c.BodyParser(json); err != nil {
		return c.JSON(fiber.Map{
			"status":  400,
			"message": "Invalid JSON",
			"success": false,
		})
	}

	found := model.User{}

	query := model.User{Username: json.Username}
	err := db.First(&found, &query).Error
	if err == gorm.ErrRecordNotFound {
		return c.JSON(fiber.Map{
			"status":  404,
			"success": false,
			"message": "Username not found",
		})
	}
	if !utils.ComparePasswords(found.Password, []byte(json.Password)) {
		return c.JSON(fiber.Map{
			"status":  401,
			"success": false,
			"message": "Invalid Password",
		})
	}

	tokenString, err := utils.GenerateJWT(found)

	if err != nil {
		return c.JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Could not generate token",
		})
	}

	return c.JSON(fiber.Map{
		"status":  200,
		"message": "success",
		"success": true,
		"token":   tokenString,
	})
}
