package handlers

import (
	"backend/database"
	"backend/model"
	"backend/utils"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	guuid "github.com/google/uuid"
)

// GetAllProducts Получить список всех продуктов
//
//	@Summary		Получить список продуктов
//	@Description	Эта функция возвращает список всех продуктов с пагинацией и возможностью подгрузки категорий
//	@Tags			Products
//	@Produce		json
//	@Param			page	query		int						false	"Номер страницы"					default(1)
//	@Param			limit	query		int						false	"Количество элементов на странице"	default(10)
//	@Success		200		{object}	map[string]interface{}	"Список продуктов с информацией о пагинации"
//	@Failure		500		{object}	map[string]interface{}	"Ошибка сервера при получении списка продуктов"
//
//	@Router			/products [get]
func GetAllProducts(c *fiber.Ctx) error {
	Products := []model.Product{}

	respons, err := utils.Paginate(database.DB.Preload("Category"), c, map[string]interface{}{}, &Products)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Failed to retrieve products",
		})
	}

	return c.Status(fiber.StatusOK).JSON(respons)
}

// GetProductById Получить продукт по ID
//
//	@Summary		Получить продукт
//	@Description	Эта функция возвращает информацию о продукте по его уникальному идентификатору
//	@Tags			Products
//	@Produce		json
//	@Param			id	path		string					true	"ID продукта"
//	@Success		200	{object}	map[string]interface{}	"Информация о продукте"
//	@Failure		400	{object}	map[string]interface{}	"Неверный запрос или отсутствующий ID"
//	@Failure		404	{object}	map[string]interface{}	"Продукт не найден"
//	@Failure		500	{object}	map[string]interface{}	"Ошибка сервера при получении продукта"
//
//	@Router			/products/{id} [get]
func GetProductById(c *fiber.Ctx) error {
	return nil
}

// CreateProduct Создать новый продукт
//	@Summary		Создать продукт
//	@Description	Эта функция позволяет создать новый продукт
//	@Tags			Products
//	@Accept			json
//	@Produce		json
//	@Param			product	body		model.Product			true	"Данные нового продукта"
//	@Success		201		{object}	map[string]interface{}	"Информация о созданном продукте"
//	@Failure		400		{object}	map[string]interface{}	"Неверный формат запроса"
//	@Failure		422		{object}	map[string]interface{}	"Ошибка валидации данных"
//	@Failure		500		{object}	map[string]interface{}	"Ошибка сервера при создании продукта"
//
//	@Router			/products [post]
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

	// var category model.Category
	// if err := DB.First(&category, "id = ?", product.CategoryID).Error; err != nil {
	// 	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
	// 		"code":    400,
	// 		"message": "Invalid category ID",
	// 	})
	// }
	product.ID = guuid.New()
	// product.Category = &category

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

// UpdateProduct Обновить продукт
//
//	@Summary		Обновить продукт
//	@Description	Эта функция обновляет информацию о продукте по его уникальному идентификатору
//	@Tags			Products
//	@Accept			json
//	@Produce		json
//	@Param			id		path		string					true	"ID продукта"
//	@Param			product	body		model.Product			true	"Данные для обновления продукта"
//	@Success		200		{object}	map[string]interface{}	"Информация об обновлённом продукте"
//	@Failure		400		{object}	map[string]interface{}	"Неверный формат запроса или отсутствующий ID"
//	@Failure		404		{object}	map[string]interface{}	"Продукт не найден"
//	@Failure		500		{object}	map[string]interface{}	"Ошибка сервера при обновлении продукта"
//
//	@Router			/products/{id} [put]
func UpdateProduct(c *fiber.Ctx) error {

	return nil
}

// DeleteProduct Удалить продукт
//
//	@Summary		Удалить продукт
//	@Description	Эта функция удаляет продукт по его уникальному идентификатору
//	@Tags			Products
//	@Produce		json
//	@Param			id	path		string					true	"ID продукта"
//	@Success		200	{object}	map[string]interface{}	"Сообщение об успешном удалении"
//	@Failure		400	{object}	map[string]interface{}	"Неверный формат запроса или отсутствующий ID"
//	@Failure		404	{object}	map[string]interface{}	"Продукт не найден"
//	@Failure		500	{object}	map[string]interface{}	"Ошибка сервера при удалении продукта"
//
//	@Router			/products/{id} [delete]
func DeleteProduct(c *fiber.Ctx) error {

	return nil
}
