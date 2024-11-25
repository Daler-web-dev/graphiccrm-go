package handlers

import (
	"backend/database"
	"backend/model"
	"backend/utils"
	"log"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	guuid "github.com/google/uuid"
	"gorm.io/gorm"
)

func CreateUser(c *fiber.Ctx) error {
	type CreateUserRequest struct {
		Username string     `json:"username" validate:"required,min=3,max=50"`
		Password string     `json:"password" validate:"required,min=4,max=100"`
		Role     model.Role `json:"role" validate:"required,oneof=admin manager seller"`
	}
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
func GetUsers(c *fiber.Ctx) error {
	db := database.DB
	Users := []model.User{}
	db.Model(&model.User{}).Order("ID asc").Limit(100).Find(&Users)

	return c.JSON(fiber.Map{
		"code":    200,
		"message": "success",
		"data":    Users,
	})
}

func UpdateUser(c *fiber.Ctx) error {
	type UpdateUserRequest struct {
		Username *string     `json:"username" validate:"required,min=3,max=50"`
		Password *string     `json:"password" validate:"required,min=4,max=100"`
		Role     *model.Role `json:"role" validate:"required,oneof=admin manager seller"`
	}

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

	// Проверка, существует ли пользователь с таким ID
	var found model.User
	err = db.First(&found, "id = ?", id).Error
	if err == gorm.ErrRecordNotFound {
		return c.JSON(fiber.Map{
			"code":    400,
			"message": "User not found",
		})
	}

	// Удаление пользователя
	err = db.Delete(&model.User{}, "id = ?", id).Error

	if err != nil {
		log.Println("Error deleting user:", err)
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
