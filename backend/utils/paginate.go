package utils

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Paginate(db *gorm.DB, c *fiber.Ctx, filter interface{}, result interface{}) (interface{}, error) {
	// Получаем параметры пагинации из запроса
	page, err := strconv.Atoi(c.Query("page", "1")) // Номер страницы (по умолчанию 1)
	if err != nil || page < 1 {
		page = 1
	}
	pageSize, err := strconv.Atoi(c.Query("pageSize", "10")) // Размер страницы (по умолчанию 10)
	if err != nil || pageSize < 1 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize // Смещение для запроса

	// Применяем фильтр, порядок, смещение и лимит
	query := db.Model(result).Where(filter).Order("id asc").Offset(offset).Limit(pageSize)

	// Выполняем запрос с пагинацией
	if err := query.Find(result).Error; err != nil {
		return nil, err
	}

	// Подсчет общего количества записей
	var total int64
	countQuery := db.Model(result).Where(filter)
	if err := countQuery.Count(&total).Error; err != nil {
		return nil, err
	}

	// Формируем ответ с данными и метаинформацией
	response := fiber.Map{
		"data":    result,
		"success": true,
		"message": "success",
		"pagination": fiber.Map{
			"page":       page,
			"pageSize":   pageSize,
			"total":      total,
			"totalPages": (total + int64(pageSize) - 1) / int64(pageSize), // Округление вверх
		},
	}

	return response, nil
}
