package handlers

import (
	"backend/database"
	"backend/model"
	"backend/utils"
	"database/sql"
	"errors"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	guuid "github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type UpdateProductRequest struct {
	Name       *string  `json:"name" validate:"omitempty,min=3,max=100"`
	CategoryID *string  `json:"categoryId" validate:"omitempty,uuid"`
	Width      *string  `json:"width" validate:"omitempty"`
	Height     *string  `json:"height" validate:"omitempty"`
	Price      *float64 `json:"price" validate:"omitempty,gte=0"`
	Unit       *string  `json:"unit" validate:"omitempty,oneof=piece meter"`
	Amount     *float64 `json:"amount" validate:"omitempty,gte=0"`
	Image      *string  `json:"image" validate:"omitempty,min=5"`
}
type ProductStatistics struct {
	ProductID        string  `json:"productId" example:"d6c9b3be-652f-45d4-8384-a5eab99f03a6"`
	Name             string  `json:"name" example:"Wooden Table"`
	ProducedQuantity float64 `json:"producedQuantity" example:"120.5"`
	SoldQuantity     float64 `json:"soldQuantity" example:"95.3"`
}

// GetAllProducts Получить список всех продуктов
//
//	@Summary		Получить список продуктов
//	@Description	Эта функция возвращает список всех продуктов с пагинацией и возможностью подгрузки категорий
//	@Tags			Products
//	@Produce		json
//	@Param			page	query		int				false	"Номер страницы"					default(1)
//	@Param			limit	query		int				false	"Количество элементов на странице"	default(10)
//	@Success		200		{array}		model.Product	"Список продуктов с информацией о пагинации"
//	@Failure		500		{object}	APIError		"Ошибка сервера при получении списка продуктов"
//
//	@Router			/products [get]
func GetAllProducts(c *fiber.Ctx) error {
	categoryId := c.Query("category")
	Products := []model.Product{}

	var filter interface{}
	if categoryId != "" {
		filter = map[string]interface{}{"category_id": categoryId}
	}

	respons, err := utils.Paginate(database.DB.Preload("Category"), c, filter, &Products)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
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
//	@Param			id	path		string			true	"ID продукта"
//	@Success		200	{object}	model.Product	"Информация о продукте"
//	@Failure		400	{object}	APIError		"Неверный запрос или отсутствующий ID"
//	@Failure		404	{object}	APIError		"Продукт не найден"
//	@Failure		500	{object}	APIError		"Ошибка сервера при получении продукта"
//
//	@Router			/products/{id} [get]
func GetProductById(c *fiber.Ctx) error {
	db := database.DB
	id, err := guuid.Parse(c.Params("id"))

	if err != nil {
		return c.JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Invalid UUID Format",
		})
	}

	Product := new(model.Product)
	err = db.Where("id = ?", id).Preload(clause.Associations).First(Product).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"status":  404,
				"success": false,
				"message": "Product not found",
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
		"data":    Product,
	})
}

// CreateProduct Создать новый продукт
//
//	@Summary		Создать продукт
//	@Description	Эта функция позволяет создать новый продукт
//	@Tags			Products
//	@Accept			json
//	@Produce		json
//	@Param			product	body		model.CreateProductRequest	true	"Данные нового продукта"
//	@Success		201		{object}	model.Product				"Информация о созданном продукте"
//	@Failure		400		{object}	APIError					"Неверный формат запроса"
//	@Failure		422		{object}	APIError					"Ошибка валидации данных"
//	@Failure		500		{object}	APIError					"Ошибка сервера при создании продукта"
//
//	@Router			/products [post]
func CreateProduct(c *fiber.Ctx) error {
	product := new(model.Product)

	if err := c.BodyParser(product); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Invalid request format",
		})
	}

	validate := validator.New()
	if err := validate.Struct(product); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"status":  422,
			"success": false,
			"message": "Validation error",
			"errors":  err.Error(),
		})
	}

	product.ID = guuid.New()

	DB := database.DB
	var category model.Category
	err := DB.First(&category, "id = ?", product.CategoryID).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"status":  404,
				"success": false,
				"message": "Category not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Could not retrieve category",
		})
	}

	err = DB.Create(&product).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Could not create product",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  201,
		"success": true,
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
//	@Param			product	body		UpdateProductRequest	true	"Данные для обновления продукта"
//	@Success		200		{object}	model.Product			"Информация об обновлённом продукте"
//	@Failure		400		{object}	APIError				"Неверный формат запроса или отсутствующий ID"
//	@Failure		404		{object}	APIError				"Продукт не найден"
//	@Failure		500		{object}	APIError				"Ошибка сервера при обновлении продукта"
//
//	@Router			/products/{id} [patch]
func UpdateProduct(c *fiber.Ctx) error {
	id, err := guuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Invalid UUID format for Product ID",
		})
	}

	var body UpdateProductRequest
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Invalid request body",
		})
	}

	if err := validator.New().Struct(body); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"status":  422,
			"success": false,
			"message": err.Error(),
		})
	}

	var product model.Product
	db := database.DB

	if err := db.First(&product, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"status":  404,
				"success": false,
				"message": "Product not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
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
	if body.Image != nil {
		product.Image = *body.Image
	}

	var category model.Category
	err = db.First(&category, "id = ?", product.CategoryID).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"status":  404,
				"success": false,
				"message": "Category not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Could not retrieve category",
		})
	}

	if err := db.Save(&product).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to update product",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  200,
		"success": true,
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
//	@Param			id	path		string			true	"ID продукта"
//	@Success		200	{object}	model.Product	"Сообщение об успешном удалении"
//	@Failure		400	{object}	APIError		"Неверный формат запроса или отсутствующий ID"
//
//	@Router			/products/{id} [delete]
func DeleteProduct(c *fiber.Ctx) error {
	id, err := guuid.Parse(c.Params("id"))

	if err != nil {
		return c.JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Invalid ID format",
		})
	}

	db := database.DB
	err = db.Where("id = ?", id).Delete(&model.Product{}).Error

	if err != nil {
		return c.JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to delete Product",
		})
	}

	return c.JSON(fiber.Map{
		"status":  200,
		"success": true,
		"message": "Product was removed",
	})
}

// SearchProducts Поиск продуктов
//
//	@Summary		Поиск продуктов
//	@Description	Эта функция позволяет искать продукты на основе текстового запроса
//	@Tags			Products
//	@Produce		json
//	@Param			q	query		string					true	"Текстовый запрос для поиска"
//	@Success		200	{object}	map[string]interface{}	"Список найденных продуктов"
//	@Failure		400	{object}	map[string]interface{}	"Параметр запроса 'q' отсутствует"
//	@Failure		500	{object}	map[string]interface{}	"Ошибка при поиске продуктов"
//	@Router			/products/search [get]
func SearchProducts(c *fiber.Ctx) error {
	query := c.Query("q")
	if query == "" {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Query parameter 'q' is required",
		})
	}

	var products []model.Product
	db := database.DB

	err := db.Raw(`
        SELECT * 
        FROM products
        WHERE search_vector @@ plainto_tsquery('russian', ?)
    `, query).Scan(&products).Error

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Error while searching products",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    products,
	})
}

// GetProductStatistics Получить статистику продукта
//
//	@Summary		Получить статистику продукта
//	@Description	Возвращает информацию о том, сколько продукта было произведено и продано за текущий месяц
//	@Tags			Products
//	@Produce		json
//	@Param			id	path		string				true	"ID продукта"
//	@Success		200	{object}	ProductStatistics	"Статистика продукта"
//	@Failure		400	{object}	APIError			"Неверный формат запроса или отсутствующий ID"
//	@Failure		404	{object}	APIError			"Продукт не найден"
//	@Failure		500	{object}	APIError			"Ошибка сервера"
//	@Router			/products/{id}/statistics [get]
func GetSingleProductStatistics(c *fiber.Ctx) error {
	productID := c.Params("id") // Получение ID продукта из URL
	if productID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Product ID is required",
		})
	}

	type SingleProductStats struct {
		ProductID        guuid.UUID `json:"productId"`
		ProductName      string     `json:"productName"`
		SoldQuantity     float64    `json:"soldQuantity"`
		ProducedQuantity float64    `json:"producedQuantity"`
	}

	var stats SingleProductStats
	currentMonth := time.Now().Month()

	// Данные о продажах
	err := database.DB.Table("order_items").
		Select("products.id as product_id, products.name as product_name, SUM(order_items.quantity) as sold_quantity").
		Joins("JOIN products ON products.id = order_items.product_id").
		Joins("JOIN orders ON orders.id = order_items.order_id").
		Where("products.id = ? AND EXTRACT(MONTH FROM orders.created_at) = ?", productID, currentMonth).
		Group("products.id, products.name").
		Scan(&stats).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to fetch sold product statistics",
		})
	}

	var producedQuantity sql.NullFloat64
	err = database.DB.Table("production_logs").
		Select("COALESCE(SUM(quantity), 0) as produced_quantity").
		Where("product_id = ? AND EXTRACT(MONTH FROM created_at) = ?", productID, currentMonth).
		Scan(&producedQuantity).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to fetch produced product statistics",
		})
	}

	stats.ProducedQuantity = 0
	if producedQuantity.Valid {
		stats.ProducedQuantity = producedQuantity.Float64
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  200,
		"success": true,
		"data":    stats,
	})
}
