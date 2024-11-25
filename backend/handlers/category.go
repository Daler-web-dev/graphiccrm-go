package handlers

import (
	"backend/database"
	"backend/model"
	"backend/utils"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	guuid "github.com/google/uuid"
)

func CreateCategory(c *fiber.Ctx) error {
	category := new(model.Category)

	if err := c.BodyParser(category); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code":    400,
			"message": "Invalid request",
		})
	}

	validate := validator.New()
	err := validate.Struct(category)
	if err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"code":    400,
			"message": err.Error(),
		})
	}
	DB := database.DB

	var existingName model.Category
	if err := DB.Where("name = ?", category.Name).First(&existingName).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"code":    409,
			"message": "Category with this name already exists",
		})
	}

	category.ID = guuid.New()

	if err := DB.Create(&category).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Could not create category",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"code":    201,
		"message": "Category created successfully",
		"data":    category,
	})
}

func GetAllCategories(c *fiber.Ctx) error {
	Categories := []model.Category{}

	respons, err := utils.Paginate(database.DB, c, map[string]interface{}{}, &Categories)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Failed to retrieve categories",
		})
	}

	return c.Status(fiber.StatusOK).JSON(respons)
}

// func GetCategoryById(c *fiber.Ctx) error  {}
// func UpdateCategory(c *fiber.Ctx) error   {}
// func DeleteCategory(c *fiber.Ctx) error   {}
