package handlers

import (
	"backend/database"
	"backend/model"
	"backend/utils"
	"errors"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	guuid "github.com/google/uuid"
	"gorm.io/gorm"
)

// CreateCategory Создать категорию
//
//	@Summary		Создать категорию
//	@Description	Эта функция позволяет создать новую категорию.
//	@Tags			Categories
//	@Accept			json
//	@Produce		json
//	@Param			category	body		model.Category			true	"Данные категории"
//	@Success		201			{object}	map[string]interface{}	"Категория успешно создана"
//	@Failure		400			{object}	map[string]interface{}	"Некорректные данные запроса"
//	@Failure		409			{object}	map[string]interface{}	"Категория с таким именем уже существует"
//	@Failure		500			{object}	map[string]interface{}	"Ошибка сервера при создании категории"
//	@Router			/categories [post]
func CreateCategory(c *fiber.Ctx) error {
	category := new(model.Category)

	if err := c.BodyParser(category); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Invalid request",
		})
	}

	validate := validator.New()
	err := validate.Struct(category)
	if err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": err.Error(),
		})
	}
	DB := database.DB

	var existingName model.Category
	if err := DB.Where("name = ?", category.Name).First(&existingName).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"status":  409,
			"success": false,
			"message": "Category with this name already exists",
		})
	}

	category.ID = guuid.New()

	if err := DB.Create(&category).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Could not create category",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  201,
		"success": true,
		"message": "Category created successfully",
		"data":    category,
	})
}

// GetAllCategories Получить все категории
//
//	@Summary		Получить все категории
//	@Description	Эта функция позволяет получить список всех категорий с поддержкой пагинации.
//	@Tags			Categories
//	@Produce		json
//	@Param			page		query		int						false	"Номер страницы"
//	@Param			pageSize	query		int						false	"Размер страницы"
//	@Success		200			{object}	map[string]interface{}	"Список категорий"
//	@Failure		500			{object}	map[string]interface{}	"Ошибка сервера при получении категорий"
//	@Router			/categories [get]
func GetAllCategories(c *fiber.Ctx) error {
	Categories := []model.Category{}

	respons, err := utils.Paginate(database.DB, c, map[string]interface{}{}, &Categories)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to retrieve categories",
		})
	}

	return c.Status(fiber.StatusOK).JSON(respons)
}

// GetCategoryById Получить категорию по ID
//
//	@Summary		Получить категорию
//	@Description	Эта функция позволяет получить информацию о категории по её уникальному идентификатору.
//	@Tags			Categories
//	@Produce		json
//	@Param			id	path		string					true	"UUID категории"
//	@Success		200	{object}	map[string]interface{}	"Информация о категории"
//	@Failure		400	{object}	map[string]interface{}	"Некорректный формат UUID"
//	@Failure		404	{object}	map[string]interface{}	"Категория не найдена"
//	@Failure		500	{object}	map[string]interface{}	"Ошибка сервера при получении категории"
//	@Router			/categories/{id} [get]
func GetCategoryById(c *fiber.Ctx) error {
	param := c.Params("id")

	id, err := guuid.Parse(param)
	if err != nil {
		return c.JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Invalid UUID Format",
		})
	}

	db := database.DB
	Category := model.Category{}

	err = db.Where("id = ?", id).First(&Category).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"status":  404,
				"success": false,
				"message": "Client not found",
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Internal Server Error",
		})
	}

	return c.JSON(fiber.Map{
		"status":  200,
		"success": true,
		"message": "success",
		"data":    Category,
	})
}

// UpdateCategory Обновить категорию
//
//	@Summary		Обновить категорию
//	@Description	Эта функция позволяет обновить данные категории по её уникальному идентификатору.
//	@Tags			Categories
//	@Accept			json
//	@Produce		json
//	@Param			id			path		string					true	"UUID категории"
//	@Param			category	body		model.Category			true	"Новые данные категории"
//	@Success		200			{object}	map[string]interface{}	"Категория успешно обновлена"
//	@Failure		400			{object}	map[string]interface{}	"Некорректные данные запроса"
//	@Failure		404			{object}	map[string]interface{}	"Категория не найдена"
//	@Failure		409			{object}	map[string]interface{}	"Имя категории уже используется"
//	@Failure		500			{object}	map[string]interface{}	"Ошибка сервера при обновлении категории"
//	@Router			/categories/{id} [put]
func UpdateCategory(c *fiber.Ctx) error {
	id, err := guuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Invalid UUID format for Category ID",
		})
	}

	var json model.Category
	if err := c.BodyParser(&json); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Invalid request body",
		})
	}

	if err := validator.New().Struct(json); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"status":  422,
			"success": false,
			"message": err.Error(),
		})
	}

	db := database.DB
	var category model.Category
	if err := db.First(&category, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"status":  404,
				"success": false,
				"message": "Category not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Internal Server Error",
		})
	}

	var existingName model.Client
	if err := db.First(&existingName, "name = ? AND id != ?", json.Name, id).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"status":  409,
			"success": false,
			"message": "Category is already used",
		})
	}

	category.Name = json.Name

	if err := db.Save(&category).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to update client",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  200,
		"success": true,
		"message": "success",
		"data":    category,
	})
}

// DeleteCategory Удалить категорию
//
//	@Summary		Удалить категорию
//	@Description	Эта функция позволяет удалить категорию из базы данных по её уникальному идентификатору.
//	@Tags			Categories
//	@Produce		json
//	@Param			id	path		string					true	"UUID категории"
//	@Success		200	{object}	map[string]interface{}	"Категория успешно удалена"
//	@Failure		400	{object}	map[string]interface{}	"Некорректный формат UUID"
//	@Failure		500	{object}	map[string]interface{}	"Ошибка сервера при удалении категории"
//	@Router			/categories/{id} [delete]
func DeleteCategory(c *fiber.Ctx) error {
	param := c.Params("id")
	id, err := guuid.Parse(param)

	if err != nil {
		return c.JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Invalid ID format",
		})
	}

	db := database.DB
	if err := db.Where("id = ?", id).Delete(&model.Category{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to delete category",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  200,
		"success": false,
		"message": "Category marked as deleted",
	})
}
