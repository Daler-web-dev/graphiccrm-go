package handlers

import (
	"backend/database"
	"backend/model"
	"backend/utils"
	"log"

	"github.com/gofiber/fiber/v2"
	guuid "github.com/google/uuid"
	"gorm.io/gorm"
)

func CreateUser(c *fiber.Ctx) error {
	type CreateUserRequest struct {
		Username string     `json:"username"`
		Password string     `json:"password"`
		Role     model.Role `json:"role"`
	}

	db := database.DB
	json := new(CreateUserRequest)

	if err := c.BodyParser(json); err != nil {
		return c.JSON(fiber.Map{
			"status":  400,
			"message": "Invalid JSON",
		})
	}

	err := db.Create(&model.User{
		Username: json.Username,
		Password: utils.HashAndSalt([]byte(json.Password)),
		ID:       guuid.New(),
		Role:     json.Role,
	}).Error

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.JSON(fiber.Map{
		"code":    200,
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
	return c.Status(fiber.StatusOK).JSON(user)
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
		Username string     `json:"username"`
		Password string     `json:"password"`
		Role     model.Role `json:"role"`
	}

	db := database.DB
	json := new(UpdateUserRequest)

	// Parse the JSON body
	if err := c.BodyParser(json); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code":    400,
			"message": "Invalid JSON",
		})
	}

	// Parse the user ID from the URL parameter
	param := c.Params("id")
	id, err := guuid.Parse(param)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code":    400,
			"message": "Invalid ID format",
		})
	}

	// Find the existing user in the database
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

	// Update the fields if they are provided
	if json.Username != "" {
		found.Username = json.Username
	}
	if json.Password != "" {
		// Assuming password hashing is done before saving (for example, bcrypt)
		hashedPassword := utils.HashAndSalt([]byte(json.Password))
		found.Password = hashedPassword
	}
	if json.Role != "" {
		found.Role = json.Role
	}

	// Save the updated user data
	if err := db.Save(&found).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Failed to update user",
		})
	}

	// Return a success response
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
