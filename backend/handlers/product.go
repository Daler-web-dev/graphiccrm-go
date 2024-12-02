package handlers

import (
	"backend/database"
	"backend/model"
	"backend/utils"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	guuid "github.com/google/uuid"
)

func GetAllProducts(c *fiber.Ctx) error {
	Products := []model.Product{}

	respons, err := utils.Paginate(database.DB, c, map[string]interface{}{}, &Products)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Failed to retrieve products",
		})
	}

	return c.Status(fiber.StatusOK).JSON(respons)
}
func GetProductById(c *fiber.Ctx) error {
	return nil
}
func CreateProduct(c *fiber.Ctx) error {
	product := new(model.Product)

	if err := c.BodyParser(product); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code":    400,
			"message": "Invalid request format",
		})
	}

	validate := validator.New()
	if err := validate.Struct(product); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"code":    422,
			"message": "Validation error",
			"errors":  err.Error(),
		})
	}

	DB := database.DB

	var category model.Category
	if err := DB.First(&category, "id = ?", product.CategoryID).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code":    400,
			"message": "Invalid category ID",
		})
	}
	product.ID = guuid.New()
	product.Category = &category

	err := DB.Create(&product).Error

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Could not create product",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"code":    201,
		"message": "Product created successfully",
		"data":    product,
	})
}
func UpdateProduct(c *fiber.Ctx) error {

	return nil
}
func DeleteProduct(c *fiber.Ctx) error {

	return nil
}
