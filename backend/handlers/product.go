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
	"gorm.io/gorm/clause"
)

type UpdateProductRequest struct {
	Name       *string   `json:"name" validate:"omitempty,min=3,max=100"`
	CategoryID *string   `json:"categoryId" validate:"omitempty,uuid"`
	Width      *string   `json:"width" validate:"omitempty"`
	Height     *string   `json:"height" validate:"omitempty"`
	Price      *float64  `json:"price" validate:"omitempty,gte=0"`
	Unit       *string   `json:"unit" validate:"omitempty,oneof=piece meter"`
	Amount     *float64  `json:"amount" validate:"omitempty,gte=0"`
	Images     *[]string `json:"images" validate:"omitempty,dive,url,min=1,max=10"`
}

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
	db := database.DB
	id, err := guuid.Parse(c.Params("id"))

	if err != nil {
		return c.JSON(fiber.Map{
			"code":    400,
			"message": "Invalid UUID Format",
		})
	}

	Product := new(model.Product)
	err = db.Where("id = ?", id).Preload(clause.Associations).First(Product).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"code":    404,
				"message": "Product not found",
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Internal Server Error",
		})
	}

	return c.JSON(fiber.Map{
		"code": 200,
		"data": Product,
	})
}

// CreateProduct Создать новый продукт
//
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
	id, err := guuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code":    400,
			"message": "Invalid UUID format for Product ID",
		})
	}

	var body UpdateProductRequest
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code":    400,
			"message": "Invalid request body",
		})
	}

	if err := validator.New().Struct(body); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"code":    422,
			"message": err.Error(),
		})
	}

	var product model.Product
	db := database.DB

	if err := db.First(&product, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"code":    404,
				"message": "Product not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Internal Server Error",
		})
	}

	if body.Name != nil {
		product.Name = *body.Name
	}
	if body.CategoryID != nil {
		product.CategoryID = *body.CategoryID
	}
	if body.Width != nil {
		product.Width = *body.Width
	}
	if body.Height != nil {
		product.Height = *body.Height
	}
	if body.Price != nil {
		product.Price = *body.Price
	}
	if body.Unit != nil {
		product.Unit = *body.Unit
	}
	if body.Amount != nil {
		product.Amount = *body.Amount
	}
	if body.Images != nil {
		product.Images = *body.Images
	}

	if err := db.Save(&product).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    500,
			"message": "Failed to update product",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"code":    200,
		"message": "Product updated successfully",
		"data":    product,
	})
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
