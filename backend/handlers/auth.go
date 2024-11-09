package handlers

import (
	"backend/database"
	"backend/model"
	"backend/utils"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

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
