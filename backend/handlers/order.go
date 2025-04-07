package handlers

import (
	"backend/auth"
	"backend/database"
	"backend/model"
	"backend/utils"
	"bytes"
	"errors"
	"fmt"
	"image/color"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	guuid "github.com/google/uuid"
	"github.com/signintech/gopdf"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type OrderUpdateRequest struct {
	ID            guuid.UUID         `gorm:"type:uuid;primaryKey" json:"id"`
	SalespersonID *guuid.UUID        `gorm:"type:uuid;not null;index" json:"salespersonId"`
	ClientID      *guuid.UUID        `gorm:"type:uuid;not null;index"  json:"clientId"`
	Products      *[]model.OrderItem `gorm:"foreignKey:OrderID" json:"products"`
	Status        *string            `json:"status" gorm:"not null" validate:"omitempty,oneof=pending in_production completed paid"`
	PaymentMethod *string            `json:"paymentMethod" gorm:"not null" validate:"omitempty,oneof=cash transfer credit"`
}

// CreateOrder Создать новый заказ
//
//	@Summary		Создать заказ
//	@Description	Эта функция позволяет продавцам и администраторам создать новый заказ. Заказ должен содержать как минимум один продукт.
//	@Tags			Orders
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			order	body		model.CreateOrderRequest	true	"Данные нового заказа"
//	@Success		201		{object}	model.Order					"Информация о созданном заказе"
//	@Failure		400		{object}	APIError					"Неверный запрос или некорректные данные заказа"
//	@Failure		403		{object}	APIError					"Недостаточно прав для создания заказа"
//	@Failure		422		{object}	APIError					"Ошибка валидации данных"
//	@Failure		404		{object}	APIError					"Один из указанных продуктов не найден"
//	@Failure		500		{object}	APIError					"Ошибка сервера при создании заказа"
//	@Router			/orders [post]
func CreateOrder(c *fiber.Ctx) error {
	user := c.Locals("user").(*auth.Claims)

	if user.Role != "seller" && user.Role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"status":  403,
			"success": false,
			"message": "Insufficient permissions to create an order",
		})
	}

	order := new(model.Order)
	if err := c.BodyParser(order); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Invalid request",
		})
	}

	order.Status = "pending"

	validate := validator.New()
	if err := validate.Struct(order); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"status":  422,
			"success": false,
			"message": err.Error(),
		})
	}

	if len(order.Products) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Order must include at least one product",
		})
	}

	tx := database.DB.Begin()
	defer tx.Rollback()

	order.ID = guuid.New()
	order.SalespersonID = user.ID
	order.TotalPrice = 0

	if err := tx.Omit("Products").Create(&order).Error; err != nil {
		log.Printf("Error creating order: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to create order",
		})
	}

	// Рассчитываем TotalPrice
	for i := range order.Products {
		product := &order.Products[i]
		product.OrderID = order.ID
		product.ID = guuid.New()

		// Используем транзакцию для запроса продукта
		var dbProduct model.Product
		if err := tx.First(&dbProduct, "id = ?", product.ProductID).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"status":  404,
				"success": false,
				"message": "Product not found",
			})
		}

		if dbProduct.Amount < product.Quantity {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":  400,
				"success": false,
				"message": fmt.Sprintf("Product named '%s' is not available in sufficient quantity. Only %f left.", dbProduct.Name, dbProduct.Amount),
			})
		}

		product.TotalPrice = dbProduct.Price * product.Quantity
		order.TotalPrice += product.TotalPrice // Увеличиваем TotalPrice в памяти

		// Сохраняем продукт заказа
		if err := tx.Create(&product).Error; err != nil {
			log.Println(err, "Error saving order item")
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"status":  500,
				"success": false,
				"message": "Failed to save order item",
			})
		}
	}

	// Обновляем TotalPrice заказа в базе данных
	if err := tx.Model(&order).Update("total_price", order.TotalPrice).Error; err != nil {
		log.Printf("Error updating order total price: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to update order total price",
		})
	}

	// Коммит транзакции
	if err := tx.Commit().Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to commit transaction",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  201,
		"message": "Order created successfully",
		"data":    order,
	})
}

// GetOrderByID Получить заказ по ID
//
//	@Summary		Получить заказ
//	@Description	Эта функция возвращает информацию о заказе по его уникальному идентификатору. Заказ включает все продукты в нём.
//	@Tags			Orders
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id	path		string		true	"UUID заказа"
//	@Success		200	{object}	model.Order	"Информация о заказе"
//	@Failure		400	{object}	APIError	"Некорректный формат UUID"
//	@Failure		404	{object}	APIError	"Заказ не найден"
//	@Failure		500	{object}	APIError	"Ошибка сервера при получении данных заказа"
//	@Router			/orders/{id} [get]
func GetOrderByID(c *fiber.Ctx) error {
	id, err := guuid.Parse(c.Params("id"))

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":   400,
			"succeess": false,
			"message":  "Invalid UUID Format",
		})
	}

	db := database.DB.Preload(clause.Associations).Preload("Products.Product")
	Order := model.Order{}

	err = db.Where("id = ?", id).First(&Order).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"status":   404,
				"succeess": false,
				"message":  "Order not found",
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":   500,
			"succeess": false,
			"message":  "Internal Server Error",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":   200,
		"succeess": true,
		"message":  "success",
		"data":     Order,
	})
}

// GetAllOrders Получить список заказов
//
//	@Summary		Получить список заказов с поддержкой фильтрации и пагинации
//	@Description	Возвращает список заказов с возможностью фильтрации по дате и пагинации.
//	@Tags			Orders
//	@Produce		json
//	@Security		BearerAuth
//	@Param			page	query		int							false	"Номер страницы"					default(1)
//	@Param			limit	query		int							false	"Количество элементов на странице"	default(10)
//	@Param			dateGte	query		string						false	"Фильтр по дате (не раньше, чем) в формате YYYY-MM-DD"
//	@Param			dateLte	query		string						false	"Фильтр по дате (не позже, чем) в формате YYYY-MM-DD"
//	@Success		200		{object}	model.CreateOrderRequest	"Список заказов с информацией о пагинации"
//	@Failure		400		{object}	APIError					"Ошибка валидации параметров запроса"
//	@Failure		500		{object}	APIError					"Ошибка сервера при получении списка заказов"
//	@Router			/orders [get]
func GetAllOrders(c *fiber.Ctx) error {
	Orders := []model.Order{}

	// Инициализация запроса
	db := database.DB

	// Обрабатываем параметр dateGte
	dateGte := c.Query("dateGte")
	if dateGte != "" {
		parsedDate, err := time.Parse("2006-01-02", dateGte)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":  400,
				"success": false,
				"message": "Invalid dateGte format, expected YYYY-MM-DD",
			})
		}
		// Добавляем фильтр по дате "с"
		db = db.Where("created_at >= ?", parsedDate)
	}

	// Обрабатываем параметр dateLte
	dateLte := c.Query("dateLte")
	if dateLte != "" {
		parsedDate, err := time.Parse("2006-01-02", dateLte)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":  400,
				"success": false,
				"message": "Invalid dateLte format, expected YYYY-MM-DD",
			})
		}
		// Добавляем фильтр по дате "до"
		db = db.Where("created_at <= ?", parsedDate)
	}

	// Выполняем пагинацию
	response, err := utils.Paginate(db, c, nil, &Orders)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to retrieve orders",
		})
	}

	return c.Status(fiber.StatusOK).JSON(response)
}

// UpdateOrder Изменить заказ
//
//	@Summary	Изменить можно любой
//	@Tags		Orders
//	@Produce	json
//	@Security	BearerAuth
//	@Param		id		path		string						true	"ID продукта"
//	@Param		order	body		model.CreateOrderRequest	true	"Данные для обновления заказа"
//	@Success	200		{object}	model.Order					"Измененный объект заказа"
//	@Failure	500		{object}	APIError					"Ошибка сервера при обновлении данных"
//	@Router		/orders [patch]
func UpdateOrder(c *fiber.Ctx) error {
	id, err := guuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Invalid UUID format for Product ID",
		})
	}

	var body OrderUpdateRequest
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

	var order model.Order
	tx := database.DB.Begin()
	defer tx.Rollback()

	if err := tx.Preload(clause.Associations).Preload("Products.Product").First(&order, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"status":  404,
				"success": false,
				"message": "Order not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Internal Server Error",
		})
	}

	if body.Products != nil {
		if len(*body.Products) <= 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":   400,
				"succeess": false,
				"message":  "Order must include at least one product",
			})
		}

		log.Println("Attempting to delete old products...")
		if err := tx.Where("order_id = ?", id).Delete(&model.OrderItem{}).Error; err != nil {
			log.Println("Error deleting old products:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"status":  500,
				"success": false,
				"message": "Failed to delete old products",
			})
		}
		log.Println("Old products deleted successfully.")

		order.Products = nil
		order.TotalPrice = 0

		for i := range *body.Products {
			product := (*body.Products)[i]
			product.OrderID = id
			product.ID = guuid.New()

			var dbProduct model.Product
			if err := database.DB.First(&dbProduct, "id = ?", product.ProductID).Error; err != nil {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
					"status":   404,
					"succeess": false,
					"message":  "Product not found",
				})
			}
			if dbProduct.Amount < product.Quantity {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"status":   400,
					"succeess": false,
					"message":  fmt.Sprintf("Product named '%s' is not available in sufficient quantity. Only %f left.", dbProduct.Name, dbProduct.Amount),
				})
			}

			product.TotalPrice = dbProduct.Price * product.Quantity
			order.TotalPrice += product.TotalPrice

			if err := tx.Create(&product).Error; err != nil {
				log.Println(err, "Error saving order item")
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"status":   500,
					"succeess": false,
					"message":  "Failed to save order item",
				})
			}
		}
	}

	if body.SalespersonID != nil {
		order.SalespersonID = *body.SalespersonID
	}
	if body.ClientID != nil {
		order.ClientID = *body.ClientID
	}
	if body.Status != nil {
		order.Status = *body.Status
	}
	if body.PaymentMethod != nil {
		order.PaymentMethod = *body.PaymentMethod
	}

	if err := tx.Save(&order).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":   500,
			"succeess": false,
			"message":  "Failed to update order",
		})
	}

	if err := tx.Commit().Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":   500,
			"succeess": false,
			"message":  "Failed to commit transaction",
		})
	}

	if err := database.DB.Preload(clause.Associations).Preload("Products.Product").First(&order, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":   500,
			"succeess": false,
			"message":  "Failed to load updated order",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  200,
		"message": "Order updated successfully",
		"order":   order,
	})
}

// DeleteOrder Удаление заказа
//
//	@Summary	Удаление заказа
//	@Tags		Orders
//	@Produce	json
//	@Security	BearerAuth
//	@Param		id	path		string		true	"UUID заказа"
//	@Success	200	{object}	model.Order	"Успешно"
//	@Failure	500	{object}	APIError	"Ошибка сервера при удалении"
//	@Router		/orders/{id} [delete]
func DeleteOrder(c *fiber.Ctx) error {
	id, err := guuid.Parse(c.Params("id"))

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"success": false,
			"message": "Invalid ID format",
		})
	}

	db := database.DB
	tx := db.Begin()
	defer tx.Rollback()

	err = tx.Where("order_id = ?", id).Delete(&model.OrderItem{}).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to delete OrderItems",
		})
	}

	err = tx.Delete(&model.Order{}, id).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to delete Order",
		})
	}

	err = tx.Commit().Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"success": false,
			"message": "Failed to commit transaction",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  200,
		"success": true,
		"message": "Order was removed",
	})
}

// GetOrderPDF Экспорт заказа в PDF
//
//	@Summary		Экспорт заказа в PDF
//	@Description	Эта функция позволяет экспортировать информацию о заказе в формате PDF
//	@Tags			Orders
//	@Produce		application/pdf
//	@Success		200	{file}		file					"PDF-файл с информацией о заказе"
//	@Failure		500	{object}	map[string]interface{}	"Ошибка генерации PDF"
//	@Router			/orders/pdf/{id} [get]
func GetOrderPDF(c *fiber.Ctx) error {
	id := c.Params("id")
	db := database.DB

	var order model.Order
	if err := db.Preload(clause.Associations).Preload("Products.Product").
		First(&order, "id = ?", id).Error; err != nil {

		// Добавляем логирование ошибок
		log.Printf("Order not found: %v | ID: %s", err, id)
		return c.Status(404).JSON(fiber.Map{
			"error": "Заказ не найден",
		})
	}

	pdfData, err := generatePDF(order)
	if err != nil {
		// Логирование ошибок генерации PDF
		log.Printf("PDF generation failed: %v | OrderID: %s", err, id)
		return c.Status(500).JSON(fiber.Map{
			"error": "Ошибка генерации PDF",
		})
	}

	// Устанавливаем правильные заголовки
	c.Set("Content-Type", "application/pdf")
	c.Set("Content-Disposition", fmt.Sprintf("attachment; filename=order_%s.pdf", id))

	// Отправка бинарных данных
	return c.Send(pdfData)
}

func generatePDF(order model.Order) ([]byte, error) {
	pdf := gopdf.GoPdf{}

	pdf.Start(gopdf.Config{
		PageSize: *gopdf.PageSizeA4,
		Unit:     gopdf.UnitPT,
	})

	pdf.AddPage()

	// Константы стилей
	const (
		margin         = 40.0
		headerFontSize = 24.0
		titleFontSize  = 18.0
		bodyFontSize   = 12.0
		smallFontSize  = 10.0
		primaryColor   = "#2d3436"
		secondaryColor = "#636e72"
		accentColor    = "#0984e3"
		lineHeight     = 1.4
		logoPath       = "assets/logo.png"
	)

	// 3. Загрузка шрифтов перед использованием
	if err := pdf.AddTTFFont("roboto", "assets/Roboto-Regular.ttf"); err != nil {
		return nil, fmt.Errorf("font load error: %v", err)
	}
	if err := pdf.AddTTFFont("roboto-bold", "assets/Roboto-Bold.ttf"); err != nil {
		return nil, fmt.Errorf("bold font load error: %v", err)
	}

	// Хелпер-функции
	setFont := func(font string, size float64) {
		pdf.SetFont(font, "", size)
	}

	setColor := func(hex string) {
		if hex == "" {
			hex = primaryColor
		}
		c := parseHexColor(hex)
		pdf.SetTextColor(c.R, c.G, c.B)
	}

	addText := func(x, y float64, text string, font string, size float64, color string) {
		setFont(font, size)
		setColor(color)
		pdf.SetX(x)
		pdf.SetY(y)
		pdf.Cell(nil, text)
	}

	// 4. Безопасная загрузка изображения
	if _, err := os.Stat(logoPath); os.IsNotExist(err) {
		return nil, fmt.Errorf("logo file not found: %s", logoPath)
	}
	if err := pdf.Image(logoPath, margin, margin, &gopdf.Rect{W: 60, H: 60}); err != nil {
		return nil, fmt.Errorf("image load failed: %v", err)
	}

	// Заголовок
	addText(margin+80, margin+15, "INVOICE", "roboto-bold", headerFontSize, accentColor)

	// Информация о компании
	companyInfo := []string{
		"Awesome Company Inc.",
		"123 Business Street, City, Country",
		"Phone: +1 234 567 890",
		"Email: contact@company.com",
	}
	currentY := margin + 40
	for _, line := range companyInfo {
		addText(margin+80, currentY, line, "roboto", smallFontSize, secondaryColor)
		currentY += 15
	}

	// Основная информация
	infoBlockY := margin + 120
	colWidth := 350.0
	infoPairs := []struct {
		Label string
		Value string
	}{
		{"Invoice ID", order.ID.String()},
		{"Date Issued", order.CreatedAt.Format("02 Jan 2006")},
		{"Due Date", order.CreatedAt.AddDate(0, 0, 7).Format("02 Jan 2006")},
		{"Client", order.Client.Name},
		{"Salesperson", order.Salesperson.Username},
		{"Status", order.Status},
		{"Payment", order.PaymentMethod},
	}

	for i, pair := range infoPairs {
		x := margin + float64(i%2)*colWidth
		y := infoBlockY + float64(i/2)*20

		addText(x, y, pair.Label+":", "roboto-bold", bodyFontSize, secondaryColor)
		addText(x+80, y, pair.Value, "roboto", bodyFontSize, primaryColor)
	}

	// Таблица товаров
	tableTop := infoBlockY + 80.0
	header := []struct {
		Title string
		Width float64
		Align string
	}{
		{"Наименование", 160, "left"},
		{"Количество", 120, "right"},
		{"Цена за м/шт", 120, "right"},
		{"Сумма", 120, "right"},
	}

	// Заголовок таблицы
	pdf.SetLineWidth(0.5)
	pdf.SetStrokeColor(223, 230, 233)
	pdf.SetFillColor(241, 242, 246)
	pdf.Rectangle(margin, tableTop, margin+530, tableTop+30, "FD", 0, 0)

	xPos := margin
	for _, h := range header {
		addText(xPos+10, tableTop+8, h.Title, "roboto-bold", bodyFontSize, primaryColor)
		xPos += h.Width
	}

	// Строки таблицы
	currentY = tableTop + 30
	for _, item := range order.Products {
		if currentY > 750 { // Проверка на новый лист
			pdf.AddPage()
			currentY = margin + 30
		}

		x := margin
		pdf.SetLineWidth(0.2)
		pdf.Line(margin, currentY+20, margin+580, currentY+20)

		// Название товара
		addText(x+10, currentY+5, item.Product.Name, "roboto", bodyFontSize, primaryColor)
		x += header[0].Width

		// Количество
		addText(x+10, currentY+5, fmt.Sprint(int(item.Quantity)), "roboto", bodyFontSize, primaryColor)
		x += header[1].Width

		// Цена
		addText(x+10, currentY+5, fmt.Sprintf("%.2f", item.Product.Price), "roboto", bodyFontSize, primaryColor)
		x += header[2].Width

		// Сумма
		addText(x+10, currentY+5, fmt.Sprintf("%.2f", item.TotalPrice), "roboto-bold", bodyFontSize, accentColor)

		currentY += 25
	}

	// Итоги
	totalsY := currentY + 30
	totals := []struct {
		Label string
		Value float64
	}{
		{"Total", order.TotalPrice},
		// {"Tax (10%)", order.TotalPrice * 0.1},
		// {"Total", order.TotalPrice * 1.1},
	}

	for _, t := range totals {
		addText(margin+400, totalsY, t.Label+":", "roboto-bold", bodyFontSize, secondaryColor)
		addText(margin+470, totalsY, fmt.Sprintf("%.2f", t.Value), "roboto-bold", bodyFontSize, primaryColor)
		totalsY += 20
	}

	// Подпись и номера страниц
	pdf.SetFont("roboto", "", smallFontSize)
	pdf.SetTextColor(99, 110, 114)
	addText(margin, 780, "Thank you for your business!", "roboto-bold", smallFontSize, accentColor)
	addText(500, 780, fmt.Sprintf("Page %d of 1", 1), "roboto", smallFontSize, secondaryColor)

	// Графическая подпись
	pdf.SetLineWidth(1)
	pdf.Line(margin, 760, margin+200, 760)
	addText(margin, 765, "Authorized Signature", "roboto", smallFontSize, secondaryColor)

	// Сохранение в буфер
	var buf bytes.Buffer
	if _, err := pdf.WriteTo(&buf); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func parseHexColor(hex string) (c color.RGBA) {
	hex = strings.TrimPrefix(hex, "#")
	if len(hex) == 3 {
		hex = string([]byte{hex[0], hex[0], hex[1], hex[1], hex[2], hex[2]})
	}
	if len(hex) != 6 {
		panic("invalid color format")
	}
	rgb, _ := strconv.ParseUint(hex, 16, 32)
	return color.RGBA{
		R: uint8(rgb >> 16),
		G: uint8(rgb >> 8),
		B: uint8(rgb),
		A: 255,
	}
}
